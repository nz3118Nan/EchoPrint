import uuid

from sqlalchemy.dialects.postgresql import insert

from src.infrastructure.database.postgres.connection import AsyncSqlDatabase
from src.infrastructure.database.postgres.models.user import User


class UserRepository:
    def __init__(self, database: AsyncSqlDatabase) -> None:
        self.database = database

    async def upsert(self, user_id: uuid.UUID, email: str) -> User:
        statement = insert(User).values(id=user_id, email=email).on_conflict_do_update(
            index_elements=[User.id], set_={"email": email}
        ).returning(User)
        async with self.database.session_scope() as session:
            return (await session.execute(statement)).scalar_one()
