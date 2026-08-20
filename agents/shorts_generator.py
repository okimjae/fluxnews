"""
Shorts Generator (MoviePy)
--------------------------
Creates a 60-second vertical video (1080×1920) for each new radio episode:
- Dark background with tenant accent color
- Title text + excerpt overlay
- Audio track from the radio episode (trimmed to 60s)
- Uploads to Cloudflare R2, inserts into shorts table.

Required env:
    DATABASE_URL, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
    R2_BUCKET, R2_PUBLIC_URL, R2_ACCOUNT_ID

Usage:
    python agents/shorts_generator.py
    python agents/shorts_generator.py --tenant=cripto
"""

import argparse
import logging
import os
import tempfile
import uuid

import httpx
from dotenv import load_dotenv

from shared.db import get_db

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger(__name__)

TENANTS = ["cripto", "saude", "tech", "financas", "games", "esportes", "streaming", "mobilidade"]

TENANT_COLORS: dict[str, tuple[int, int, int]] = {
    "cripto":     (247, 147, 26),   # #F7931A
    "saude":      (0, 168, 120),    # #00A878
    "tech":       (99, 102, 241),   # #6366F1
    "financas":   (30, 107, 79),    # #1E6B4F
    "games":      (224, 64, 251),   # #E040FB
    "esportes":   (230, 57, 70),    # #E63946
    "streaming":  (255, 59, 48),    # #FF3B30
    "mobilidade": (0, 180, 216),    # #00B4D8
}

SHORT_DURATION = 60  # seconds
VIDEO_W, VIDEO_H = 1080, 1920


def download_audio(url: str, dest: str) -> None:
    with httpx.stream("GET", url, timeout=30) as r:
        r.raise_for_status()
        with open(dest, "wb") as f:
            for chunk in r.iter_bytes():
                f.write(chunk)


def upload_to_r2(path: str, key_path: str) -> str:
    try:
        import boto3
    except ImportError:
        raise RuntimeError("boto3 not installed")

    access_key = os.environ.get("R2_ACCESS_KEY_ID")
    secret_key = os.environ.get("R2_SECRET_ACCESS_KEY")
    bucket = os.environ.get("R2_BUCKET")
    account_id = os.environ.get("R2_ACCOUNT_ID", "")
    public_url = os.environ.get("R2_PUBLIC_URL", "")

    s3 = boto3.client(
        "s3",
        endpoint_url=f"https://{account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name="auto",
    )
    with open(path, "rb") as f:
        s3.put_object(Bucket=bucket, Key=key_path, Body=f, ContentType="video/mp4")
    return f"{public_url}/{key_path}"


def create_short(episode: dict, post: dict) -> tuple[str, str]:
    """Build MP4, return (video_path, thumbnail_path) as temp file paths."""
    from moviepy import (
        AudioFileClip,
        ColorClip,
        CompositeVideoClip,
        TextClip,
    )

    accent = TENANT_COLORS.get(episode["tenant"], (255, 255, 255))

    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as af:
        audio_path = af.name
    download_audio(episode["audio_url"], audio_path)

    audio = AudioFileClip(audio_path).subclipped(0, min(SHORT_DURATION, episode.get("duration_seconds", 60)))

    # Background
    bg = ColorClip(size=(VIDEO_W, VIDEO_H), color=(10, 12, 15), duration=audio.duration)

    # Accent top bar
    bar = ColorClip(size=(VIDEO_W, 6), color=accent, duration=audio.duration).with_position(("center", 120))

    # Title text (wrapped)
    title = episode["title"][:80]
    title_clip = (
        TextClip(
            text=title,
            font_size=58,
            color="white",
            font="DejaVu-Sans-Bold",
            method="caption",
            size=(VIDEO_W - 120, None),
            text_wrap=True,
        )
        .with_duration(audio.duration)
        .with_position(("center", 200))
    )

    # Excerpt / transcript excerpt
    excerpt = (episode.get("transcript") or post.get("excerpt") or "")[:200]
    excerpt_clip = (
        TextClip(
            text=excerpt,
            font_size=36,
            color="#AAAAAA",
            font="DejaVu-Sans",
            method="caption",
            size=(VIDEO_W - 160, None),
            text_wrap=True,
        )
        .with_duration(audio.duration)
        .with_position(("center", VIDEO_H - 400))
    )

    # Compose
    video = CompositeVideoClip([bg, bar, title_clip, excerpt_clip]).with_audio(audio)

    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as vf:
        video_path = vf.name
    video.write_videofile(video_path, fps=24, codec="libx264", audio_codec="aac", logger=None)

    # Thumbnail: first frame as PNG
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tf:
        thumb_path = tf.name
    video.save_frame(thumb_path, t=0)

    audio.close()
    video.close()
    os.unlink(audio_path)

    return video_path, thumb_path


def generate_short(conn, tenant: str) -> bool:
    # Latest episode without a short
    episode = conn.execute(
        """
        SELECT r.* FROM radio_episodes r
        WHERE r.tenant = %s
          AND NOT EXISTS (
            SELECT 1 FROM shorts s WHERE s.tenant = r.tenant
            AND s.published_at::date = r.published_at::date
          )
        ORDER BY r.published_at DESC LIMIT 1
        """,
        [tenant],
    ).fetchone()

    if not episode:
        log.info("[%s] No new episodes to short-ify.", tenant)
        return False

    post = conn.execute(
        "SELECT excerpt FROM posts WHERE tenant = %s AND title = %s LIMIT 1",
        [tenant, episode["title"]],
    ).fetchone() or {}

    log.info("[%s] Creating short for: %s", tenant, episode["title"][:60])

    video_path, thumb_path = create_short(episode, post)

    uid = uuid.uuid4().hex[:8]
    video_key = f"shorts/{tenant}-{uid}.mp4"
    thumb_key = f"shorts/{tenant}-{uid}.png"

    video_url = upload_to_r2(video_path, video_key)
    thumb_url = upload_to_r2(thumb_path, thumb_key)
    os.unlink(video_path)
    os.unlink(thumb_path)

    conn.execute(
        """
        INSERT INTO shorts (tenant, post_id, video_url, thumbnail_url, duration_seconds, published_at)
        VALUES (%s, NULL, %s, %s, %s, NOW())
        """,
        [tenant, video_url, thumb_url, min(episode.get("duration_seconds", 60), SHORT_DURATION)],
    )
    conn.commit()
    log.info("  ✓ Short saved: %s", video_url)
    return True


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--tenant", default=None)
    args = parser.parse_args()

    tenants = [args.tenant] if args.tenant else TENANTS
    log.info("🎬 Shorts Generator starting…")

    generated = 0
    with get_db() as conn:
        for tenant in tenants:
            try:
                if generate_short(conn, tenant):
                    generated += 1
            except Exception as exc:
                log.error("[%s] ✗ Failed: %s", tenant, exc)

    log.info("✅ Done. %d shorts generated.", generated)


if __name__ == "__main__":
    main()
