"""
Agentis FastAPI backend.
Runs as a sidecar process spawned by Tauri on port 57431.
"""

import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import ApiKeyRequest, ApiKeyStatus, StatusResponse
from routers.projects import router as projects_router
from routers.llm import router as llm_router

app = FastAPI(title="Agentis Backend", version="0.1.0")

# CORS — allow Tauri window and Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["tauri://localhost", "http://localhost:1420"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# In-memory API key store
api_key_store: dict[str, str] = {}


@app.on_event("startup")
def on_startup() -> None:
    # Create required directories
    base = Path.home() / "Documents" / "Agentis"
    (base / "projects").mkdir(parents=True, exist_ok=True)
    (base / "logs").mkdir(parents=True, exist_ok=True)

    # Configure rotating file logging
    log_file = base / "logs" / "backend.log"
    handler = RotatingFileHandler(
        log_file,
        maxBytes=5 * 1024 * 1024,  # 5 MB
        backupCount=3,
    )
    handler.setFormatter(
        logging.Formatter("%(asctime)s %(levelname)s %(name)s: %(message)s")
    )
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    root_logger.addHandler(handler)

    logging.info("Agentis backend started")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "version": "0.1.0"}


@app.post("/api/settings/api-key", response_model=StatusResponse)
def set_api_key(body: ApiKeyRequest) -> StatusResponse:
    api_key_store["anthropic_api_key"] = body.api_key
    return StatusResponse(status="ok")


@app.get("/api/settings/api-key/status", response_model=ApiKeyStatus)
def get_api_key_status() -> ApiKeyStatus:
    configured = bool(api_key_store.get("anthropic_api_key"))
    return ApiKeyStatus(configured=configured)


app.include_router(projects_router)
app.include_router(llm_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=57431)
