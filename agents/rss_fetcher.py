"""
RSS Fetcher Agent
-----------------
Reads active RSS sources (kind='rss') from the DB, fetches each feed with
feedparser, deduplicates via source_url, and inserts new articles as draft posts.

Usage:
    python agents/rss_fetcher.py
    python agents/rss_fetcher.py --tenant=cripto
"""

import argparse
import logging
import time
from datetime import datetime, timezone

import feedparser
from dotenv import load_dotenv

from shared.db import get_db, slugify

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger(__name__)


def fetch_active_sources(conn, tenant: str | None) -> list[dict]:
    query = "SELECT * FROM sources WHERE kind = 'rss' AND active = 1"
    params: list = []
    if tenant:
        query += " AND tenant = %s"
        params.append(tenant)
    return conn.execute(query, params).fetchall()


def existing_source_urls(conn, tenant: str) -> set[str]:
    rows = conn.execute(
        "SELECT source_url FROM posts WHERE tenant = %s AND source_url IS NOT NULL",
        [tenant],
    ).fetchall()
    return {r["source_url"] for r in rows}


def parse_date(entry) -> datetime | None:
    for attr in ("published_parsed", "updated_parsed"):
        val = getattr(entry, attr, None)
        if val:
            return datetime(*val[:6], tzinfo=timezone.utc)
    return None


def process_feed(conn, source: dict) -> tuple[int, int]:
    log.info("[%s] Fetching %s — %s", source["tenant"], source["label"], source["url"])

    feed = feedparser.parse(source["url"], agent="fluxnews-bot/1.0", request_headers={"Accept": "application/rss+xml"})
    if feed.bozo and not feed.entries:
        log.warning("  ✗ Feed parse error: %s", feed.bozo_exception)
        return 0, 0

    seen = existing_source_urls(conn, source["tenant"])
    inserted = skipped = 0

    for entry in feed.entries:
        url = getattr(entry, "link", None) or getattr(entry, "id", None)
        if not url or url in seen:
            skipped += 1
            continue

        title = getattr(entry, "title", "Sem título").strip()
        excerpt = (getattr(entry, "summary", "") or "")[:300].strip()
        content = (
            getattr(entry, "content", [{}])[0].get("value", "")
            or getattr(entry, "summary", "")
            or excerpt
        )
        author = getattr(entry, "author", "") or ""
        pub_date = parse_date(entry)
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
                    feed.feed.get("title", source["label"]), author,
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
    args = parser.parse_args()

    log.info("🔄 RSS Fetcher starting…")
    total_in = total_sk = 0

    with get_db() as conn:
        sources = fetch_active_sources(conn, args.tenant)
        if not sources:
            log.info("No active RSS sources found.")
            return
        for source in sources:
            ins, sk = process_feed(conn, source)
            total_in += ins
            total_sk += sk

    log.info("✅ Done. %d inserted, %d skipped.", total_in, total_sk)


if __name__ == "__main__":
    main()
