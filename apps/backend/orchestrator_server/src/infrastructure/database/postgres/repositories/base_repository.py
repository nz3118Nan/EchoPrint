from typing import Generic, TypeVar

from sqlalchemy.orm import DeclarativeBase

from src.infrastructure.database.postgres.connection import AsyncSqlDatabase

T = TypeVar("T", bound=DeclarativeBase)


class PostgresBaseCRUD(Generic[T]):
    def __init__(self, model: type[T], database: AsyncSqlDatabase) -> None:
        self._model = model
        self._database = database

    async def create(self, data: dict, refresh: bool = False) -> T | None:
        db_object = self._model(**data)
        async with self._database.session_scope() as session:
            session.add(db_object)
            await session.flush()
            if refresh:
                await session.refresh(db_object)
                return db_object
        return None
