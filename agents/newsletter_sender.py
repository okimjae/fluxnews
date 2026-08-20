"""
Newsletter Sender (Resend)
--------------------------
Builds and sends the weekly digest for each tenant via Resend API.
Picks the top 5 published posts by SEO score, renders HTML, sends to
all confirmed subscribers, records the issue in newsletter_issues.

Required env: DATABASE_URL, RESEND_API_KEY
Usage:
    python agents/newsletter_sender.py
    python agents/newsletter_sender.py --tenant=cripto --dry-run
"""

import argparse
import logging
import os
from datetime import datetime, timezone

import httpx
from dotenv import load_dotenv

from shared.db import get_db

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger(__name__)

RESEND_API = "https://api.resend.com/emails"

TENANTS = ["cripto", "saude", "tech", "financas", "games", "esportes", "streaming", "mobilidade"]
TENANT_NAMES: dict[str, str] = {
    "cripto":     "CriptoSignal",
    "saude":      "Saúde em Dia",
    "tech":       "TechPulse",
    "financas":   "Financeira em Foco",
    "games":      "GamerZone",
    "esportes":   "Esporte Narrativa",
    "streaming":  "Streaming Brasil",
    "mobilidade": "Mobilidade Urbana",
}
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
FROM_EMAILS: dict[str, str] = {
    "cripto":     "newsletter@criptosignal.com.br",
    "saude":      "newsletter@saudeemdia.com.br",
    "tech":       "newsletter@techpulse.com.br",
    "financas":   "newsletter@financeiraemfoco.com.br",
    "games":      "newsletter@gamerzone.com.br",
    "esportes":   "newsletter@esportenarativa.com.br",
    "streaming":  "newsletter@streamingbrasil.com.br",
    "mobilidade": "newsletter@mobilidadeurbana.com.br",
}


def build_html(posts: list[dict], tenant: str, site_url: str, name: str) -> str:
    items_html = ""
    for i, post in enumerate(posts, 1):
        url = f"{site_url}/artigo/{post['slug']}"
        items_html += f"""
        <tr>
          <td style="padding:16px 0;border-bottom:1px solid #eee">
            <span style="font-family:monospace;font-size:11px;color:#999">#{i}</span>
            <h3 style="margin:4px 0 6px;font-size:16px;line-height:1.3">
              <a href="{url}" style="color:#111;text-decoration:none">{post['title']}</a>
            </h3>
            <p style="margin:0;font-size:14px;color:#555;line-height:1.5">{(post['excerpt'] or '')[:180]}…</p>
            <a href="{url}" style="font-size:13px;color:#888;text-decoration:none">Ler artigo →</a>
          </td>
        </tr>"""

    week = datetime.now(timezone.utc).strftime("%-d de %B de %Y")
    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><title>{name} — Digest Semanal</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:system-ui,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
    <tr><td>
      <table width="640" align="center" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:8px;overflow:hidden;max-width:100%">
        <tr>
          <td style="padding:32px 40px 16px;border-bottom:2px solid #111">
            <p style="margin:0 0 4px;font-size:12px;font-family:monospace;text-transform:uppercase;letter-spacing:.1em;color:#999">
              Digest semanal · {week}
            </p>
            <h1 style="margin:0;font-size:24px;font-weight:700">{name}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px">
            <p style="margin:0 0 24px;font-size:15px;color:#555">
              Os 5 artigos mais relevantes desta semana, com curadoria editorial independente.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">{items_html}</table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #eee;background:#fafafa">
            <p style="margin:0;font-size:12px;color:#aaa;text-align:center">
              Você está recebendo este email por ser assinante do {name}.<br>
              <a href="{site_url}/newsletter?unsub={{{{email}}}}" style="color:#aaa">Cancelar inscrição</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>"""


def send_email(to: str, subject: str, html: str, from_email: str) -> bool:
    key = os.environ.get("RESEND_API_KEY")
    if not key:
        raise RuntimeError("RESEND_API_KEY not set")
    resp = httpx.post(
        RESEND_API,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={"from": from_email, "to": to, "subject": subject, "html": html},
        timeout=15,
    )
    return resp.status_code in (200, 201)


def send_newsletter(conn, tenant: str, dry_run: bool) -> int:
    name = TENANT_NAMES.get(tenant, tenant)
    site_url = SITE_URLS.get(tenant, "https://fluxnews.com.br")
    from_email = FROM_EMAILS.get(tenant, f"newsletter@{tenant}.com.br")

    # Top 5 posts by SEO score this week
    posts = conn.execute(
        """
        SELECT title, slug, excerpt FROM posts
        WHERE tenant = %s AND status = 'published'
          AND published_at >= NOW() - INTERVAL '7 days'
        ORDER BY COALESCE(seo_score, 0) DESC
        LIMIT 5
        """,
        [tenant],
    ).fetchall()

    if not posts:
        log.info("[%s] No posts this week — skipping.", tenant)
        return 0

    # Confirmed subscribers
    subscribers = conn.execute(
        "SELECT email FROM subscribers WHERE tenant = %s AND confirmed_at IS NOT NULL AND unsubscribed_at IS NULL",
        [tenant],
    ).fetchall()

    if not subscribers:
        log.info("[%s] No confirmed subscribers — skipping.", tenant)
        return 0

    week = datetime.now(timezone.utc).strftime("%-d/%m")
    subject = f"{name} · Digest {week} — {posts[0]['title'][:45]}"
    html = build_html(list(posts), tenant, site_url, name)

    if dry_run:
        log.info("[%s] DRY RUN — would send to %d subscribers.", tenant, len(subscribers))
        log.info("  Subject: %s", subject)
        return 0

    sent = 0
    for sub in subscribers:
        if send_email(sub["email"], subject, html, from_email):
            sent += 1
        else:
            log.warning("  ✗ Failed to send to %s", sub["email"])

    # Record the issue
    conn.execute(
        """
        INSERT INTO newsletter_issues (tenant, subject, html_content, sent_at, recipient_count)
        VALUES (%s, %s, %s, NOW(), %s)
        """,
        [tenant, subject, html, sent],
    )
    conn.commit()
    log.info("[%s] ✓ Sent to %d/%d subscribers.", tenant, sent, len(subscribers))
    return sent


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--tenant", default=None)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    tenants = [args.tenant] if args.tenant else TENANTS
    log.info("📧 Newsletter Sender starting (dry_run=%s)…", args.dry_run)

    total = 0
    with get_db() as conn:
        for tenant in tenants:
            sent = send_newsletter(conn, tenant, args.dry_run)
            total += sent

    log.info("✅ Done. %d emails sent.", total)


if __name__ == "__main__":
    main()
