import uuid

from sqlalchemy import select

from src.domain.media import MediaPhoto as MediaPhotoEntity, MediaPhotoRepository
from src.infrastructure.database.postgres.connection import AsyncSqlDatabase
from src.infrastructure.database.postgres.mappers.media_photo_mapper import entity_to_dict, model_to_entity
from src.infrastructure.database.postgres.models.session_input import MediaPhoto as MediaPhotoORM, Session
from src.infrastructure.database.postgres.repositories.base_repository import PostgresBaseCRUD


class PostgresMediaPhotoRepository(PostgresBaseCRUD[MediaPhotoORM], MediaPhotoRepository):
    def __init__(self, database: AsyncSqlDatabase) -> None:
        super().__init__(MediaPhotoORM, database)

    async def create_photo(
        self, user_id: uuid.UUID, photo: MediaPhotoEntity
    ) -> MediaPhotoEntity | None:
        async with self._database.session_scope() as db_session:
            owned_session = await db_session.scalar(
                select(Session).where(Session.id == photo.session_id, Session.user_id == user_id)
            )
            if owned_session is None:
                return None
            photo_orm = MediaPhotoORM(**entity_to_dict(photo))
            db_session.add(photo_orm)
            await db_session.flush()
            await db_session.refresh(photo_orm)
            return model_to_entity(photo_orm)
