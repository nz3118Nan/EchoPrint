import uuid

from pydantic import BaseModel


class CreateSessionResponse(BaseModel):
    id: uuid.UUID
    title: str | None
