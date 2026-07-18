import uuid
from typing import Literal

from pydantic import BaseModel, Field


class PhotoUpload(BaseModel):
    session_id: uuid.UUID
    source: Literal["camera", "file"]
    filename: str
    media_type: str
    content: bytes = Field(repr=False)


class PhotoUploadResponse(BaseModel):
    id: uuid.UUID
    session_id: uuid.UUID
    media_type: str
    size: int
    metadata: dict[str, str]
