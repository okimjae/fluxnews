"""
Telegram Breaking News Bot
--------------------------
Publishes the latest published posts (not yet sent) to each tenant's
Telegram channel.

Required env: TELEGRAM_BOT_TOKEN_{TENANT} (one per tenant), DATABASE_URL
Usage:
    python agents/telegram_publisher.py
    python agents/telegram_publisher.py --tenant=cripto --limit=3
"""

import argparse
import logging
import os

import httpx
from dotenv import load_dotenv

from shared.db import get_db

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger(__name__)

TENANTS = ["cripto", "saude", "tech", "financas", "games", "esportes", "streaming", "mobilidade"]
SITE_URLS: dict[str, str] = {
    "cripto":     "https://criptosignal.com.br",
    "saude":      "https://saudeemdia.com.br",
    "tech":       "https://techpulse.com.br",
    "financas":   "https://financeiraemfoco.com.br",
    "games":      "https://gamerzone.com.br",
    "esportes":   "https://esportenarativa.com.br",
    "streaming":  "https://streamingbrasil.com.br",
    "mobilidade": "https://mobilidadeurbana.com.br",
}


def get_bot_token(tenant: str) -> str | None:
    return os.environ.get(f"TELEGRAM_BOT_TOKEN_{tenant.upper()}")


def get_channel_id(tenant: str) -> str | None:
    return os.environ.get(f"TELEGRAM_CHANNEL_{tenant.upper()}")


def send_message(token: str, chat_id: str, text: str) -> bool:
    resp = httpx.post(
        f"https://api.telegram.org/bot{token}/sendMessage",
        json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"},
        timeout=10,
    )
    return resp.status_code == 200


def format_post(post: dict, site_url: str) -> str:
    url = f"{site_url}/artigo/{post['slug']}"
    excerpt = (post["excerpt"] or "")[:200]
    return (
        f"<b>{post['title']}</b>\n\n"
        f"{excerpt}…\n\n"
        f"<a href='{url}'>Ler artigo completo →</a>"
    )


def publish_for_tenant(conn, tenant: str, limit: int) -> int:
    token = get_bot_token(tenant)
    channel = get_channel_id(tenant)

    if not token or not channel:
        log.warning("[%s] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL — skipping", tenant)
        return 0

    # Posts published but not yet sent to Telegram (using seo_score IS NULL as proxy
    # until we add a telegram_sent_at column in a future migration)
    posts = conn.execute(
        """
        SELECT id, title, slug, excerpt FROM posts
        WHERE tenant = %s AND status = 'published'
          AND seo_score IS NOT NULL
        ORDER BY published_at DESC
        LIMIT %s
        """,
        [tenant, limit],
    ).fetchall()

    site_url = SITE_URLS.get(tenant, "https://fluxnews.com.br")
    sent = 0
    for post in posts:
        msg = format_post(post, site_url)
        if send_message(token, channel, msg):
            log.info("  [%s] ✓ Sent: %s", tenant, post["title"][:50])
            sent += 1
        else:
            log.error("  [%s] ✗ Failed to send: %s", tenant, post["title"][:50])

    return sent


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--tenant", default=None)
    parser.add_argument("--limit", type=int, default=3)
    args = parser.parse_args()

    tenants = [args.tenant] if args.tenant else TENANTS
    log.info("📣 Telegram Publisher starting (tenants=%s)…", tenants)

    total = 0
    with get_db() as conn:
        for tenant in tenants:
            sent = publish_for_tenant(conn, tenant, args.limit)
            total += sent

    log.info("✅ Done. %d messages sent.", total)


if __name__ == "__main__":
    main()
