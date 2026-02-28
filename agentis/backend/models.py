from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal
import uuid


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    customer_context: str = Field(..., min_length=1)
    objectives: str = Field(..., min_length=1)
    viz_thoughts: str = Field(default="")


class ProjectUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=200)
    customer_context: str | None = None
    objectives: str | None = None
    viz_thoughts: str | None = None


class Project(BaseModel):
    id: str
    name: str
    customer_context: str
    objectives: str
    viz_thoughts: str
    created_at: str   # ISO 8601
    updated_at: str   # ISO 8601
    status: Literal["draft", "generated", "ready"]


class ApiKeyRequest(BaseModel):
    api_key: str


class ApiKeyStatus(BaseModel):
    configured: bool


class StatusResponse(BaseModel):
    status: Literal["ok"]


class FileWriteResponse(BaseModel):
    status: Literal["ok"]
    filename: str


# Suppress unused import warning — uuid is used at runtime by routers
_ = uuid.uuid4
_ = datetime.now
