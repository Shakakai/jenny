"""
LLM endpoints — implemented in Phase 2.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/api/llm", tags=["llm"])

# Phase 2 will add:
# POST /api/llm/generate   (SSE streaming generation pipeline)
# POST /api/llm/suggest-name
