"""
Simple in-memory session store.

Maps session_id -> { "rag_chain": <LCEL runnable>, "title": str, "created_at": float }

IMPORTANT / MVP LIMITATION:
This is a plain process-local dict. It is intentionally simple for a first
version, but it means:
  - All sessions are lost on server restart or redeploy.
  - It will NOT work correctly across multiple server instances/workers
    (e.g. `uvicorn --workers 4`, or multiple Render instances), since each
    process has its own dict.
For production-scale, multi-instance deployment, the rag_chain construction
inputs (transcript + a persistent vector-store collection id) would need to
live in a shared store (e.g. a database/cache keyed by session_id), with the
chain rebuilt (or the retriever reloaded via `load_rag_chain`) per request
instead of held in memory. That is out of scope for this MVP by design.
"""

import time
import uuid
from typing import Optional, Dict, Any

_sessions: Dict[str, Dict[str, Any]] = {}


def create_session_id() -> str:
    return uuid.uuid4().hex


def save_session(session_id: str, rag_chain, title: str = "") -> None:
    _sessions[session_id] = {
        "rag_chain": rag_chain,
        "title": title,
        "created_at": time.time(),
    }


def get_session(session_id: str) -> Optional[Dict[str, Any]]:
    return _sessions.get(session_id)


def session_exists(session_id: str) -> bool:
    return session_id in _sessions
