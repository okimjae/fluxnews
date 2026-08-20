"""
Radio Episode Generator (TTS)
------------------------------
Picks the top published post of the day per tenant, generates a spoken
script via Gemini, converts to MP3 via Google Cloud TTS, uploads to
Cloudflare R2, and inserts a record into radio_episodes.

Required env:
    DATABASE_URL, GEMINI_API_KEY, GOOGLE_CLOUD_TTS_KEY
    R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL

Usage:
    python agents/radio_generator.py
    python agents/radio_generator.py --tenant=cripto
"""

import argparse
import base64
import logging
import os
import uuid
from datetime import datetime, timezone

import google.generativeai as genai
import httpx
from dotenv import load_dotenv

from shared.db import get_db

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger(__name__)

TENANTS = ["cripto", "saude", "tech", "financas", "games", "esportes", "streaming", "mobilidade"]

PERSONAS: dict[str, str] = {
    "cripto":     "Apresentador de podcast de criptomoedas. Tom analítico e direto.",
    "saude":      "Apresentador de podcast de saúde. Tom acolhedor e baseado em ciência.",
    "tech":       "Apresentador de podcast de tecnologia. Tom técnico e preciso.",
    "financas":   "Apresentador de podcast financeiro. Tom profissional e educativo.",
    "games":      "Apresentador de podcast de games. Tom animado e apaixonado.",
    "esportes":   "Apresentador de podcast esportivo. Tom vibrante e analítico.",
    "streaming":  "Apresentador de podcast de entretenimento. Tom cultural e crítico.",
    "mobilidade": "Apresentador de podcast de mobilidade urbana. Tom informativo e moderno.",
}


# ─── GEMINI: SCRIPT GENERATION ───────────────────────────────────────────────

def generate_script(post: dict) -> str:
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        raise RuntimeError("GEMINI_API_KEY not set")
    genai.configure(api_key=key)

    persona = PERSONAS.get(post["tenant"], "Apresentador de podcast editorial.")
    prompt = f"""Você é: {persona}

Escreva um roteiro de podcast de 2 minutos (≈280 palavras) sobre o artigo abaixo.
Regras:
- Linguagem falada, fluida — como se estivesse conversando com o ouvinte
- Sem termos de IA, sem clickbait
- Inclua uma introdução curta, os pontos principais e uma conclusão com perspectiva
- Retorne APENAS o roteiro, sem indicações de cena

TÍTULO: {post['title']}
CONTEÚDO: {(post['content'] or '')[:1500]}

ROTEIRO:"""

    model = genai.GenerativeModel("gemini-2.0-flash")
    resp = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(temperature=0.75, max_output_tokens=600),
    )
    return resp.text.strip()


# ─── GOOGLE CLOUD TTS ────────────────────────────────────────────────────────

def text_to_speech(script: str, lang: str = "pt-BR") -> bytes:
    key = os.environ.get("GOOGLE_CLOUD_TTS_KEY")
    if not key:
        raise RuntimeError("GOOGLE_CLOUD_TTS_KEY not set")

    resp = httpx.post(
        f"https://texttospeech.googleapis.com/v1/text:synthesize?key={key}",
        json={
            "input": {"text": script},
            "voice": {"languageCode": lang, "name": "pt-BR-Standard-B", "ssmlGender": "MALE"},
            "audioConfig": {"audioEncoding": "MP3", "speakingRate": 0.95, "pitch": -1.0},
        },
        timeout=30,
    )
    resp.raise_for_status()
    audio_b64 = resp.json()["audioContent"]
    return base64.b64decode(audio_b64)


# ─── CLOUDFLARE R2 UPLOAD ────────────────────────────────────────────────────

def upload_to_r2(audio_bytes: bytes, filename: str) -> str:
    import hmac
    import hashlib

    access_key = os.environ.get("R2_ACCESS_KEY_ID")
    secret_key = os.environ.get("R2_SECRET_ACCESS_KEY")
    bucket = os.environ.get("R2_BUCKET")
    public_url = os.environ.get("R2_PUBLIC_URL", "")

    if not all([access_key, secret_key, bucket]):
        raise RuntimeError("R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET not set")

    account_id = os.environ.get("R2_ACCOUNT_ID", "")
    endpoint = f"https://{account_id}.r2.cloudflarestorage.com"
    key_path = f"radio/{filename}"

    # Use httpx with AWS Signature V4 via boto3-style approach
    # For simplicity, we use the Cloudflare R2 S3-compatible API via boto3
    try:
        import boto3
        s3 = boto3.client(
            "s3",
            endpoint_url=endpoint,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name="auto",
        )
        s3.put_object(Bucket=bucket, Key=key_path, Body=audio_bytes, ContentType="audio/mpeg")
        return f"{public_url}/{key_path}"
    except ImportError:
        raise RuntimeError("boto3 not installed — add it to pyproject.toml")


# ─── MAIN ─────────────────────────────────────────────────────────────────────

def generate_episode(conn, tenant: str) -> bool:
    # Latest published post not yet converted to radio
    row = conn.execute(
        """
        SELECT p.id, p.tenant, p.title, p.content, p.lang
        FROM posts p
        WHERE p.tenant = %s AND p.status = 'published'
          AND NOT EXISTS (
            SELECT 1 FROM radio_episodes r
            WHERE r.tenant = p.tenant
              AND r.title = p.title
          )
        ORDER BY p.published_at DESC
        LIMIT 1
        """,
        [tenant],
    ).fetchone()

    if not row:
        log.info("[%s] No new posts to convert.", tenant)
        return False

    log.info("[%s] Generating radio episode for: %s", tenant, row["title"][:60])

    script = generate_script(row)
    log.info("  ✓ Script generated (%d chars)", len(script))

    audio_bytes = text_to_speech(script, lang=row.get("lang", "pt") + "-BR" if "-" not in row.get("lang", "pt") else row.get("lang", "pt-BR"))
    log.info("  ✓ Audio synthesized (%d bytes)", len(audio_bytes))

    filename = f"{tenant}-{uuid.uuid4().hex[:8]}.mp3"
    audio_url = upload_to_r2(audio_bytes, filename)
    log.info("  ✓ Uploaded: %s", audio_url)

    # Estimate duration: ~150 words/min, MP3 ~1min ≈ 1MB rough, use script words
    word_count = len(script.split())
    duration_sec = int(word_count / 2.5)  # ~150 wpm

    conn.execute(
        """
        INSERT INTO radio_episodes
            (tenant, lang, title, audio_url, transcript, duration_seconds, published_at)
        VALUES (%s, %s, %s, %s, %s, %s, NOW())
        """,
        [tenant, row.get("lang", "pt"), row["title"], audio_url, script, duration_sec],
    )
    conn.commit()
    log.info("  ✓ Episode saved (~%ds)", duration_sec)
    return True


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--tenant", default=None)
    args = parser.parse_args()

    tenants = [args.tenant] if args.tenant else TENANTS
    log.info("🎙️ Radio Generator starting…")

    generated = 0
    with get_db() as conn:
        for tenant in tenants:
            try:
                if generate_episode(conn, tenant):
                    generated += 1
            except Exception as exc:
                log.error("[%s] ✗ Failed: %s", tenant, exc)

    log.info("✅ Done. %d episodes generated.", generated)


if __name__ == "__main__":
    main()
