import uuid

import pytest
from sqlalchemy import select

from src.domain.media import MediaMessage as MediaMessageEntity
from src.infrastructure.database.postgres.models.session_input import MediaMessage, Session
from src.infrastructure.database.postgres.models.user import User
from src.infrastructure.database.postgres.repositories import PostgresMediaMessageRepository
from src.infrastructure.database.postgres.repositories.user_repository import UserRepository


@pytest.mark.integration
@pytest.mark.asyncio
async def test_create_saves_complete_message(database):
    user_id = uuid.uuid4()
    session_id = uuid.uuid4()
    await UserRepository(database).upsert(user_id, f"message-{user_id}@example.com")
    async with database.session_scope() as db_session:
        db_session.add(Session(id=session_id, user_id=user_id, title="message input"))

    try:
        saved = await PostgresMediaMessageRepository(database).create_message(
            user_id,
            MediaMessageEntity(session_id=session_id, content="A quiet path"),
        )

        assert saved is not None
        async with database.session_scope() as db_session:
            row = await db_session.scalar(select(MediaMessage).where(MediaMessage.id == saved.id))
            assert row is not None
            assert row.content == "A quiet path"
    finally:
        async with database.session_scope() as db_session:
            user = await db_session.get(User, user_id)
            if user:
                await db_session.delete(user)
