import uuid
from abc import ABC, abstractmethod

from .entities import Session


class SessionRepository(ABC):
    @abstractmethod
    async def create_session(self, user_id: uuid.UUID, title: str | None = None) -> Session:
        ...
