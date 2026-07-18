import uuid

from pydantic import BaseModel, Field, field_validator


class MessageCreate(BaseModel):
    session_id: uuid.UUID
    content: str = Field(min_length=1, max_length=5000)

    @field_validator("content")
    @classmethod
    def content_must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Message cannot be blank")
        return value


class MessageCreateResponse(BaseModel):
    id: uuid.UUID
    session_id: uuid.UUID
    content: str
