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
import google.generativeai as genai

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
    genai.configure(api_key=key)
    model = genai.GenerativeModel("gemini-2.0-flash")
    resp = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(temperature=0.7, max_output_tokens=1800),
    )
    return resp.text.strip()


# ─── PROMPT ───────────────────────────────────────────────────────────────────

def build_prompt(post: dict) -> str:
    persona = PERSONAS.get(post["tenant"], "Jornalista editorial independente.")
    return f"""Você é: {persona}

Reescreva o artigo abaixo em português brasileiro para o nosso blog editorial.
Regras:
- Título: mantenha ou melhore (sem clickbait)
- 3–5 parágrafos, cada um com 80–120 palavras
- Linguagem fluida, sem termos genéricos de IA
- Adicione contexto analítico próprio
- Finalize com perspectiva editorial
- Retorne SOMENTE o artigo em texto corrido, sem marcações

TÍTULO ORIGINAL: {post['title']}
CONTEÚDO ORIGINAL:
{(post['content'] or '')[:2000]}

ARTIGO REESCRITO:"""


# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--tenant", default=None)
    parser.add_argument("--limit", type=int, default=10)
    args = parser.parse_args()

    log.info("🤖 Content Generator starting (tenant=%s, limit=%d)", args.tenant or "all", args.limit)

    with get_db() as conn:
        query = "SELECT * FROM posts WHERE status = 'draft' AND published_at IS NULL"
        params: list = []
        if args.tenant:
            query += " AND tenant = %s"
            params.append(args.tenant)
        query += " ORDER BY created_at ASC LIMIT %s"
        params.append(args.limit)

        drafts = conn.execute(query, params).fetchall()

    if not drafts:
        log.info("No draft posts found.")
        return

    log.info("Found %d drafts to process.", len(drafts))
    processed = failed = 0

    with get_db() as conn:
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
