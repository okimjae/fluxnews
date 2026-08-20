"""Shared PostgreSQL connection via psycopg3 (direct DATABASE_URL)."""

import os
from contextlib import contextmanager
from typing import Generator

import psycopg
from psycopg.rows import dict_row


def get_conn_string() -> str:
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL is not set")
    return url


@contextmanager
def get_db() -> Generator[psycopg.Connection, None, None]:
    """Yield a psycopg3 connection with dict_row and autocommit off."""
    with psycopg.connect(get_conn_string(), row_factory=dict_row) as conn:
        yield conn


def slugify(text: str, max_len: int = 80) -> str:
    import re
    import unicodedata

    text = unicodedata.normalize("NFD", text.lower())
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text.strip())
    return text[:max_len]
