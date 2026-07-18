import uuid

from src.domain.session import Session as SessionEntity, SessionRepository
from src.infrastructure.database.postgres.connection import AsyncSqlDatabase
from src.infrastructure.database.postgres.mappers.session_mapper import model_to_entity
from src.infrastructure.database.postgres.models.session_input import Session as SessionORM
from src.infrastructure.database.postgres.repositories.base_repository import PostgresBaseCRUD


class PostgresSessionRepository(PostgresBaseCRUD[SessionORM], SessionRepository):
    def __init__(self, database: AsyncSqlDatabase) -> None:
        super().__init__(SessionORM, database)

    async def create_session(
        self, user_id: uuid.UUID, title: str | None = None
    ) -> SessionEntity:
        session = await self.create(
            {"user_id": user_id, "title": title, "metadata_": {}}, refresh=True
        )
        assert session is not None
        return model_to_entity(session)
