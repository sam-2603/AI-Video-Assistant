
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
