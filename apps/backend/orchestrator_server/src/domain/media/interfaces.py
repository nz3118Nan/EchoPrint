import uuid
from abc import ABC, abstractmethod

from .entities import MediaPhoto, MediaVoice


class MediaPhotoRepository(ABC):
    @abstractmethod
    async def create_photo(self, user_id: uuid.UUID, photo: MediaPhoto) -> MediaPhoto | None:
        """Create a photo when its session belongs to the user."""
        ...


class MediaVoiceRepository(ABC):
    @abstractmethod
    async def create_voice(self, user_id: uuid.UUID, voice: MediaVoice) -> MediaVoice | None:
        """Create a voice recording when its session belongs to the user."""
        ...

    @abstractmethod
    async def set_transcript(self, voice_id: uuid.UUID, transcript: str) -> MediaVoice:
        """Persist a completed transcript in voice metadata."""
        ...
