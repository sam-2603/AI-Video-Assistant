"""
FastAPI entrypoint. This is the ONLY new top-level backend file.

It does not contain any AI/pipeline logic — it just wires up CORS and the
api.routes router, which in turn calls the existing run_pipeline()/
ask_question() from main.py / core.rag_engine.

Run with:
    uvicorn app:app --reload          (local dev, from inside backend/)
    uvicorn app:app --host 0.0.0.0 --port $PORT   (production)
"""

import os
import logging

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router as api_router

load_dotenv()

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="AI Video Assistant API",
    description="API layer around the existing video/meeting RAG pipeline.",
    version="1.0.0",
)

# Comma-separated list of allowed origins, e.g.:
#   ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.onrender.com
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
def root():
    return {"service": "AI Video Assistant API", "docs": "/docs"}
