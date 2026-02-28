"""
Project management endpoints.
All projects live at ~/Documents/Agentis/projects/{project_id}/
"""

import json
import shutil
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import PlainTextResponse

from models import FileWriteResponse, Project, ProjectCreate, ProjectUpdate

router = APIRouter(prefix="/api/projects", tags=["projects"])

PROJECTS_BASE = Path.home() / "Documents" / "Agentis" / "projects"
ALLOWED_READ_FILES = {"model.py", "synthetic_data.csv", "model.py.original"}
ALLOWED_WRITE_FILES = {"model.py", "synthetic_data.csv"}


def _read_project(project_dir: Path) -> Project | None:
    """Read project.json from a directory. Returns None if missing or malformed."""
    project_file = project_dir / "project.json"
    if not project_file.exists():
        return None
    try:
        data = json.loads(project_file.read_text())
        return Project(**data)
    except Exception:
        return None


def _write_project(project_dir: Path, project: Project) -> None:
    project_file = project_dir / "project.json"
    project_file.write_text(project.model_dump_json(indent=2))


def _validate_filename(filename: str, allowed: set[str]) -> None:
    """Raise HTTPException if filename is not allowed or contains path traversal."""
    if "/" in filename or ".." in filename:
        raise HTTPException(status_code=403, detail="Path traversal is not allowed")
    if filename not in allowed:
        raise HTTPException(
            status_code=403,
            detail=f"File '{filename}' is not allowed. Allowed: {sorted(allowed)}",
        )


@router.get("/", response_model=list[Project])
def list_projects() -> list[Project]:
    PROJECTS_BASE.mkdir(parents=True, exist_ok=True)
    projects: list[Project] = []
    for item in PROJECTS_BASE.iterdir():
        if item.is_dir():
            project = _read_project(item)
            if project is not None:
                projects.append(project)
    projects.sort(key=lambda p: p.created_at, reverse=True)
    return projects


@router.post("/", response_model=Project, status_code=201)
def create_project(body: ProjectCreate) -> Project:
    project_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    project = Project(
        id=project_id,
        name=body.name,
        customer_context=body.customer_context,
        objectives=body.objectives,
        viz_thoughts=body.viz_thoughts,
        created_at=now,
        updated_at=now,
        status="draft",
    )

    project_dir = PROJECTS_BASE / project_id
    project_dir.mkdir(parents=True, exist_ok=True)
    for subdir in ("runs", "visualizations", "user_data", "exports"):
        (project_dir / subdir).mkdir(exist_ok=True)

    _write_project(project_dir, project)
    (project_dir / "model.py").write_text("\n")

    return project


@router.get("/{project_id}", response_model=Project)
def get_project(project_id: str) -> Project:
    project_dir = PROJECTS_BASE / project_id
    project = _read_project(project_dir)
    if project is None:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found")
    return project


@router.put("/{project_id}", response_model=Project)
def update_project(project_id: str, body: ProjectUpdate) -> Project:
    project_dir = PROJECTS_BASE / project_id
    project = _read_project(project_dir)
    if project is None:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found")

    update_data = body.model_dump(exclude_none=True)
    updated_fields = {**project.model_dump(), **update_data}
    updated_fields["updated_at"] = datetime.now(timezone.utc).isoformat()
    updated_project = Project(**updated_fields)

    _write_project(project_dir, updated_project)
    return updated_project


@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: str) -> None:
    project_dir = PROJECTS_BASE / project_id
    if not project_dir.exists():
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found")
    shutil.rmtree(project_dir)


@router.get("/{project_id}/files/{filename}")
def read_project_file(project_id: str, filename: str) -> PlainTextResponse:
    _validate_filename(filename, ALLOWED_READ_FILES)

    project_dir = PROJECTS_BASE / project_id
    if not project_dir.exists():
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found")

    file_path = project_dir / filename
    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"File '{filename}' not found in project '{project_id}'",
        )

    return PlainTextResponse(file_path.read_text())


@router.put("/{project_id}/files/{filename}", response_model=FileWriteResponse)
async def write_project_file(
    project_id: str, filename: str, request: Request
) -> FileWriteResponse:
    _validate_filename(filename, ALLOWED_WRITE_FILES)

    project_dir = PROJECTS_BASE / project_id
    if not project_dir.exists():
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found")

    raw = await request.body()
    (project_dir / filename).write_bytes(raw)

    return FileWriteResponse(status="ok", filename=filename)
