import uuid
from abc import ABC, abstractmethod

from .entities import MediaPhoto


class MediaPhotoRepository(ABC):
    @abstractmethod
    async def create_photo(self, user_id: uuid.UUID, photo: MediaPhoto) -> MediaPhoto | None:
        """Create a photo when its session belongs to the user."""
        ...
