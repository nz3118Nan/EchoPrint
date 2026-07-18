import uuid

from pydantic import BaseModel, Field


class VoiceUpload(BaseModel):
    session_id: uuid.UUID
    filename: str
    media_type: str
    duration_ms: int = Field(ge=0)
    content: bytes = Field(repr=False)


class VoiceUploadResponse(BaseModel):
    id: uuid.UUID
    session_id: uuid.UUID
    media_type: str
    size: int
    duration_ms: int | None
    transcript: str
