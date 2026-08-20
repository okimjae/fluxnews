"""
SEO Scorer Agent
----------------
Scores published posts on readability, keyword density, and meta quality.
Updates seo_score (0–100) on each post.

Usage:
    python agents/seo_scorer.py
    python agents/seo_scorer.py --tenant=cripto
"""

import argparse
import logging
import re

from dotenv import load_dotenv

from shared.db import get_db

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger(__name__)

# Niche keywords per tenant — boost score when these appear in title/content
TENANT_KEYWORDS: dict[str, list[str]] = {
    "cripto":     ["bitcoin", "ethereum", "defi", "blockchain", "criptomoeda", "web3", "altcoin"],
    "saude":      ["saúde", "bem-estar", "nutrição", "exercício", "medicina", "prevenção"],
    "tech":       ["tecnologia", "software", "ia", "api", "cloud", "open source", "dev"],
    "financas":   ["investimento", "mercado", "ações", "renda fixa", "tesouro", "dividendo"],
    "games":      ["jogo", "game", "playstation", "xbox", "nintendo", "rpg", "fps"],
    "esportes":   ["futebol", "basquete", "tênis", "atletismo", "copa", "campeonato"],
    "streaming":  ["série", "filme", "netflix", "disney", "hbo", "lançamento", "temporada"],
    "mobilidade": ["elétrico", "ev", "mobilidade", "transporte", "bicicleta", "metrô"],
}


def count_words(text: str) -> int:
    return len(re.findall(r"\w+", text))


def keyword_density(text: str, keywords: list[str]) -> float:
    """Returns fraction of keywords found at least once in text."""
    text_lower = text.lower()
    found = sum(1 for kw in keywords if kw in text_lower)
    return found / len(keywords) if keywords else 0.0


def score_post(post: dict) -> int:
    """
    Scoring rubric (0–100):
      - Title length (5–70 chars)       → up to 20 pts
      - Excerpt present (≥80 chars)     → up to 15 pts
      - Content word count (300–1500)   → up to 25 pts
      - Keyword density (≥30% coverage) → up to 25 pts
      - Slug quality (no timestamps)    → up to 15 pts
    """
    score = 0
    title = post["title"] or ""
    excerpt = post["excerpt"] or ""
    content = post["content"] or ""
    slug = post["slug"] or ""
    tenant = post["tenant"]
    keywords = TENANT_KEYWORDS.get(tenant, [])

    # Title length
    tlen = len(title)
    if 10 <= tlen <= 70:
        score += 20
    elif 5 <= tlen < 10 or 70 < tlen <= 90:
        score += 10

    # Excerpt
    elen = len(excerpt)
    if elen >= 120:
        score += 15
    elif elen >= 80:
        score += 10
    elif elen >= 40:
        score += 5

    # Content word count
    wc = count_words(content)
    if 400 <= wc <= 1500:
        score += 25
    elif 200 <= wc < 400 or 1500 < wc <= 2500:
        score += 15
    elif wc >= 100:
        score += 5

    # Keyword density
    density = keyword_density(f"{title} {content}", keywords)
    if density >= 0.5:
        score += 25
    elif density >= 0.3:
        score += 15
    elif density >= 0.1:
        score += 8

    # Slug quality: penalize timestamp-only slugs
    if not re.search(r"-\d{13}$", slug):
        score += 15
    elif len(slug) > 20:
        score += 7

    return min(score, 100)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--tenant", default=None)
    parser.add_argument("--limit", type=int, default=100)
    args = parser.parse_args()

    log.info("📊 SEO Scorer starting…")

    with get_db() as conn:
        query = "SELECT id, tenant, title, slug, excerpt, content FROM posts WHERE status = 'published'"
        params: list = []
        if args.tenant:
            query += " AND tenant = %s"
            params.append(args.tenant)
        query += " ORDER BY published_at DESC LIMIT %s"
        params.append(args.limit)

        posts = conn.execute(query, params).fetchall()
        log.info("Scoring %d posts…", len(posts))

        updated = 0
        for post in posts:
            seo = score_post(post)
            conn.execute(
                "UPDATE posts SET seo_score = %s WHERE id = %s",
                [seo, post["id"]],
            )
            updated += 1

        conn.commit()

    log.info("✅ Done. %d posts scored.", updated)


if __name__ == "__main__":
    main()
