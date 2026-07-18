import uuid
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class Session:
    user_id: uuid.UUID
    title: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)
    id: uuid.UUID | None = None
    ended_time: datetime | None = None
    created_time: datetime | None = None
    updated_time: datetime | None = None
    is_active: bool = True
