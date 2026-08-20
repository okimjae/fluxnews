"""
NewsAPI Fetcher Agent
---------------------
Reads active sources (kind='newsapi', url=query string) from the DB,
hits NewsAPI /everything, deduplicates via source_url, inserts drafts.

Usage:
    python agents/newsapi_fetcher.py
    python agents/newsapi_fetcher.py --tenant=cripto --page-size=20
"""

import argparse
import logging
import os
import time

import httpx
from dotenv import load_dotenv

from shared.db import get_db, slugify

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger(__name__)

NEWSAPI_BASE = "https://newsapi.org/v2/everything"


def fetch_articles(query: str, page_size: int = 20) -> list[dict]:
    key = os.environ.get("NEWSAPI_KEY")
    if not key:
        raise RuntimeError("NEWSAPI_KEY is not set")

    resp = httpx.get(
        NEWSAPI_BASE,
        params={
            "q": query,
            "language": "pt",
            "sortBy": "publishedAt",
            "pageSize": page_size,
            "apiKey": key,
        },
        headers={"User-Agent": "fluxnews-bot/1.0"},
        timeout=15,
    )
    resp.raise_for_status()
    data = resp.json()
    if data["status"] != "ok":
        raise RuntimeError(f"NewsAPI error: {data.get('message')}")
    return data["articles"]


def existing_source_urls(conn, tenant: str) -> set[str]:
    rows = conn.execute(
        "SELECT source_url FROM posts WHERE tenant = %s AND source_url IS NOT NULL",
        [tenant],
    ).fetchall()
    return {r["source_url"] for r in rows}


def process_newsapi_source(conn, source: dict, page_size: int) -> tuple[int, int]:
    log.info("[%s] NewsAPI query: '%s'", source["tenant"], source["url"])

    try:
        articles = fetch_articles(source["url"], page_size)
    except Exception as exc:
        log.error("  ✗ Fetch failed: %s", exc)
        return 0, 0

    seen = existing_source_urls(conn, source["tenant"])
    inserted = skipped = 0

    for article in articles:
        url = article.get("url")
        if not url or url in seen or article.get("title") == "[Removed]":
            skipped += 1
            continue

        title = (article["title"] or "").strip()
        excerpt = (article.get("description") or "")[:300].strip()
        content = article.get("content") or excerpt
        author = article.get("author") or ""
        pub_str = article.get("publishedAt")
        pub_date = None
        if pub_str:
            from datetime import datetime, timezone
            pub_date = datetime.fromisoformat(pub_str.replace("Z", "+00:00"))

        slug = f"{slugify(title)}-{int(time.time() * 1000)}"

        try:
            conn.execute(
                """
                INSERT INTO posts
                    (tenant, title, slug, excerpt, content, category, author,
                     source_url, published_at, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'draft')
                ON CONFLICT DO NOTHING
                """,
                [
                    source["tenant"], title, slug, excerpt, content,
                    article.get("source", {}).get("name", ""), author,
                    url, pub_date,
                ],
            )
            seen.add(url)
            inserted += 1
        except Exception as exc:
            log.error("  ✗ Insert failed for '%s': %s", title[:50], exc)

    conn.execute(
        "UPDATE sources SET last_fetched_at = NOW() WHERE id = %s",
        [source["id"]],
    )
    conn.commit()
    log.info("  ✓ %d inserted, %d skipped", inserted, skipped)
    return inserted, skipped


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--tenant", default=None)
    parser.add_argument("--page-size", type=int, default=20)
    args = parser.parse_args()

    log.info("🔄 NewsAPI Fetcher starting…")
    total_in = total_sk = 0

    with get_db() as conn:
        query = "SELECT * FROM sources WHERE kind = 'newsapi' AND active = 1"
        params: list = []
        if args.tenant:
            query += " AND tenant = %s"
            params.append(args.tenant)
        sources = conn.execute(query, params).fetchall()

        if not sources:
            log.info("No active NewsAPI sources found.")
            return

        for source in sources:
            ins, sk = process_newsapi_source(conn, source, args.page_size)
            total_in += ins
            total_sk += sk

    log.info("✅ Done. %d inserted, %d skipped.", total_in, total_sk)


if __name__ == "__main__":
    main()
