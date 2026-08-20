"""
AI Content Generator
--------------------
Picks draft posts, rewrites them into editorial articles via Groq (primary)
or Gemini Flash (fallback), then marks them as published.

Usage:
    python agents/content_generator.py
    python agents/content_generator.py --tenant=cripto --limit=10
"""

import argparse
import logging
import os
import time
from datetime import datetime, timezone

from dotenv import load_dotenv
from google import genai
from google.genai import types as genai_types

from shared.db import get_db

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger(__name__)

# ─── PERSONAS ─────────────────────────────────────────────────────────────────

PERSONAS: dict[str, str] = {
    "cripto":     "Analista de criptomoedas com foco em dados on-chain e fundamentos de DeFi. Tom técnico mas acessível.",
    "saude":      "Jornalista especializado em saúde e bem-estar. Baseado em evidências científicas, tom acolhedor.",
    "tech":       "Engenheiro de software e escritor de tecnologia. Direto, técnico, sem hype.",
    "financas":   "Analista financeiro. Foco em fundamentos, análise macro e educação financeira.",
    "games":      "Gamer e crítico de jogos. Apaixonado, opinativo, conhece a indústria por dentro.",
    "esportes":   "Jornalista esportivo. Análise tática, números e narrativa humana.",
    "streaming":  "Crítico de entretenimento e streaming. Cultura pop com profundidade editorial.",
    "mobilidade": "Especialista em mobilidade urbana, carros elétricos e futuro do transporte.",
}

# ─── LLM CALLS ────────────────────────────────────────────────────────────────

def generate(prompt: str) -> str:
    """Call Gemini 2.0 Flash — primary and only LLM per project spec."""
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        raise RuntimeError("GEMINI_API_KEY not set")
    client = genai.Client(api_key=key)
    resp = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=genai_types.GenerateContentConfig(temperature=0.7, max_output_tokens=1800),
    )
    return resp.text.strip()


# ─── PROMPT ───────────────────────────────────────────────────────────────────

def build_prompt(post: dict) -> str:
    persona = PERSONAS.get(post["tenant"], "Jornalista editorial independente.")
    return f"""Você é: {persona}

O artigo abaixo pode estar em inglês, espanhol ou português. Independente do idioma de origem, produza a versão final SEMPRE em português brasileiro fluente e natural.

Regras editoriais:
- Título: mantenha a essência, melhore se possível (sem clickbait, sem ALL CAPS)
- 3–5 parágrafos de 80–120 palavras cada
- Linguagem fluida — proibido frases genéricas de IA ("vale ressaltar", "no contexto atual")
- Adicione contexto analítico relevante para o público brasileiro
- Finalize com perspectiva editorial própria
- Retorne SOMENTE o artigo final em texto corrido, sem títulos, sem marcações, sem prefácio

TÍTULO ORIGINAL: {post['title']}
CONTEÚDO ORIGINAL ({len(post['content'] or '')} chars):
{(post['content'] or '')[:2000]}

ARTIGO EM PORTUGUÊS BRASILEIRO:"""


# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--tenant", default=None)
    parser.add_argument("--limit", type=int, default=10)
    args = parser.parse_args()

    log.info("🤖 Content Generator starting (tenant=%s, limit=%d)", args.tenant or "all", args.limit)

    tenants = [args.tenant] if args.tenant else list(PERSONAS.keys())

    with get_db() as conn:
        drafts = []
        for t in tenants:
            rows = conn.execute(
                "SELECT id, tenant, title, content, status, created_at FROM posts "
                "WHERE status = 'draft' AND tenant = %s "
                "ORDER BY created_at DESC LIMIT %s",
                [t, args.limit],
                prepare=False,
            ).fetchall()
            drafts.extend(rows)

        if not drafts:
            log.info("No draft posts found.")
            return

        log.info("Found %d drafts to process.", len(drafts))
        processed = failed = 0

        for post in drafts:
            log.info("\n[%s] \"%s\"", post["tenant"], post["title"][:60])
            try:
                content = generate(build_prompt(post))
                conn.execute(
                    """
                    UPDATE posts
                    SET content = %s, status = 'published', published_at = %s
                    WHERE id = %s
                    """,
                    [content, datetime.now(timezone.utc), post["id"]],
                    prepare=False,
                )
                conn.commit()
                log.info("  ✓ Published (%d chars)", len(content))
                processed += 1
            except Exception as exc:
                log.error("  ✗ Failed: %s", exc)
                failed += 1

            time.sleep(0.5)  # rate limiting

        log.info("\n✅ Done. %d published, %d failed.", processed, failed)


if __name__ == "__main__":
    main()
