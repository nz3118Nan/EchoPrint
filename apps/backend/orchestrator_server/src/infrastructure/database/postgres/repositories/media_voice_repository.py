import uuid

from sqlalchemy import select

from src.domain.media import MediaVoice as MediaVoiceEntity, MediaVoiceRepository
from src.infrastructure.database.postgres.connection import AsyncSqlDatabase
from src.infrastructure.database.postgres.mappers.media_voice_mapper import entity_to_dict, model_to_entity
from src.infrastructure.database.postgres.models.session_input import MediaVoice as MediaVoiceORM, Session
from src.infrastructure.database.postgres.repositories.base_repository import PostgresBaseCRUD


class PostgresMediaVoiceRepository(PostgresBaseCRUD[MediaVoiceORM], MediaVoiceRepository):
    def __init__(self, database: AsyncSqlDatabase) -> None:
        super().__init__(MediaVoiceORM, database)

    async def create_voice(
        self, user_id: uuid.UUID, voice: MediaVoiceEntity
    ) -> MediaVoiceEntity | None:
        async with self._database.session_scope() as db_session:
            owned_session = await db_session.scalar(
                select(Session).where(Session.id == voice.session_id, Session.user_id == user_id)
            )
            if owned_session is None:
                return None
            voice_orm = MediaVoiceORM(**entity_to_dict(voice))
            db_session.add(voice_orm)
            await db_session.flush()
            await db_session.refresh(voice_orm)
            return model_to_entity(voice_orm)

    async def set_transcript(self, voice_id: uuid.UUID, transcript: str) -> MediaVoiceEntity:
        async with self._database.session_scope() as db_session:
            voice = await db_session.get(MediaVoiceORM, voice_id)
            if voice is None:
                raise ValueError("Voice recording not found")
            voice.metadata_ = {**voice.metadata_, "transcript": transcript}
            await db_session.flush()
            await db_session.refresh(voice)
            return model_to_entity(voice)
