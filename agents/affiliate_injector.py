"""
Affiliate Link Injector
-----------------------
Scans published post content for product/service keywords and wraps the
first occurrence in each post with the configured affiliate link.
Updates posts in place (content field only).

Config: affiliate_links.json (per-tenant keyword → URL map)
Usage:
    python agents/affiliate_injector.py
    python agents/affiliate_injector.py --tenant=cripto --dry-run
"""

import argparse
import json
import logging
import re
from pathlib import Path

from dotenv import load_dotenv

from shared.db import get_db

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger(__name__)

# Default affiliate keywords per tenant — extend in affiliate_links.json
DEFAULT_LINKS: dict[str, dict[str, str]] = {
    "cripto": {
        "Binance": "https://www.binance.com/?ref=FLUXNEWS",
        "Coinbase": "https://www.coinbase.com/join/FLUXNEWS",
        "Ledger": "https://shop.ledger.com/?r=FLUXNEWS",
        "Bybit": "https://www.bybit.com/invite?ref=FLUXNEWS",
    },
    "saude": {
        "MyProtein": "https://www.myprotein.com.br/?ref=fluxnews",
        "Vivara": "https://www.vivara.com.br/?aff=fluxnews",
    },
    "tech": {
        "AWS": "https://aws.amazon.com/?ref=fluxnews",
        "DigitalOcean": "https://m.do.co/c/fluxnews",
        "GitHub": "https://github.com/?ref=fluxnews",
    },
    "financas": {
        "XP Investimentos": "https://www.xpi.com.br/?ref=fluxnews",
        "Nubank": "https://nubank.com.br/cobrar/fluxnews",
        "Inter": "https://inter.co/?ref=fluxnews",
    },
    "games": {
        "Nuuvem": "https://www.nuuvem.com/?ref=fluxnews",
        "Steam": "https://store.steampowered.com/?ref=fluxnews",
    },
    "esportes": {
        "Nike": "https://www.nike.com.br/?ref=fluxnews",
        "Adidas": "https://www.adidas.com.br/?ref=fluxnews",
        "Netshoes": "https://www.netshoes.com.br/?ref=fluxnews",
    },
    "streaming": {
        "Amazon Prime": "https://www.amazon.com.br/prime?ref=fluxnews",
        "Apple TV": "https://tv.apple.com/?ref=fluxnews",
    },
    "mobilidade": {
        "99": "https://99app.com/?ref=fluxnews",
        "iFood": "https://www.ifood.com.br/?ref=fluxnews",
    },
}


def load_links(tenant: str) -> dict[str, str]:
    """Merge defaults with optional affiliate_links.json overrides."""
    config_path = Path(__file__).parent / "affiliate_links.json"
    overrides: dict[str, dict[str, str]] = {}
    if config_path.exists():
        with open(config_path) as f:
            overrides = json.load(f)
    base = dict(DEFAULT_LINKS.get(tenant, {}))
    base.update(overrides.get(tenant, {}))
    return base


def inject_links(content: str, links: dict[str, str]) -> tuple[str, int]:
    """Replace first occurrence of each keyword with an anchor tag."""
    injected = 0
    for keyword, url in links.items():
        # Only inject if keyword not already a link
        pattern = rf"(?<!href=\"[^\"]*?)(?<!>)({re.escape(keyword)})(?![^<]*<\/a>)"
        replacement = rf'<a href="{url}" rel="sponsored noopener" target="_blank">\1</a>'
        new_content, count = re.subn(pattern, replacement, content, count=1)
        if count:
            content = new_content
            injected += 1
    return content, injected


def process_tenant(conn, tenant: str, dry_run: bool) -> int:
    links = load_links(tenant)
    if not links:
        log.info("[%s] No affiliate links configured.", tenant)
        return 0

    posts = conn.execute(
        "SELECT id, title, content FROM posts WHERE tenant = %s AND status = 'published' LIMIT 200",
        [tenant],
    ).fetchall()

    total_injected = 0
    for post in posts:
        new_content, count = inject_links(post["content"] or "", links)
        if count and not dry_run:
            conn.execute("UPDATE posts SET content = %s WHERE id = %s", [new_content, post["id"]])
            total_injected += count
        elif count and dry_run:
            log.info("  [DRY] [%s] Would inject %d links into '%s'", tenant, count, post["title"][:50])
            total_injected += count

    if not dry_run and total_injected:
        conn.commit()

    return total_injected


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--tenant", default=None)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    tenants = [args.tenant] if args.tenant else list(DEFAULT_LINKS.keys())
    log.info("🔗 Affiliate Injector starting (dry_run=%s)…", args.dry_run)

    total = 0
    with get_db() as conn:
        for tenant in tenants:
            injected = process_tenant(conn, tenant, args.dry_run)
            log.info("[%s] %d affiliate links injected.", tenant, injected)
            total += injected

    log.info("✅ Done. %d total links injected.", total)


if __name__ == "__main__":
    main()
