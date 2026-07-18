import uuid
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class MediaPhoto:
    session_id: uuid.UUID
    content: bytes
    media_type: str
    metadata: dict[str, Any] = field(default_factory=dict)
    id: uuid.UUID | None = None
    created_time: datetime | None = None
    updated_time: datetime | None = None
    is_active: bool = True


@dataclass
class MediaVoice:
    session_id: uuid.UUID
    content: bytes
    media_type: str
    duration_ms: int | None = None
    metadata: dict[str, Any] = field(default_factory=dict)
    id: uuid.UUID | None = None
    created_time: datetime | None = None
    updated_time: datetime | None = None
    is_active: bool = True
