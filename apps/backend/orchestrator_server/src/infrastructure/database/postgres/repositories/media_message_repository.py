import uuid

from sqlalchemy import select

from src.domain.media import MediaMessage as MediaMessageEntity, MediaMessageRepository
from src.infrastructure.database.postgres.connection import AsyncSqlDatabase
from src.infrastructure.database.postgres.mappers.media_message_mapper import entity_to_dict, model_to_entity
from src.infrastructure.database.postgres.models.session_input import MediaMessage as MediaMessageORM, Session
from src.infrastructure.database.postgres.repositories.base_repository import PostgresBaseCRUD


class PostgresMediaMessageRepository(PostgresBaseCRUD[MediaMessageORM], MediaMessageRepository):
    def __init__(self, database: AsyncSqlDatabase) -> None:
        super().__init__(MediaMessageORM, database)

    async def create_message(
        self, user_id: uuid.UUID, message: MediaMessageEntity
    ) -> MediaMessageEntity | None:
        async with self._database.session_scope() as db_session:
            owned_session = await db_session.scalar(
                select(Session).where(Session.id == message.session_id, Session.user_id == user_id)
            )
            if owned_session is None:
                return None
            message_orm = MediaMessageORM(**entity_to_dict(message))
            db_session.add(message_orm)
            await db_session.flush()
            await db_session.refresh(message_orm)
            return model_to_entity(message_orm)
