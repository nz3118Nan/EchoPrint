import base64
import uuid

import pytest
from sqlalchemy import select

from src.infrastructure.database.postgres.models.session_input import MediaPhoto, Session
from src.infrastructure.database.postgres.models.user import User
from src.domain.media import MediaPhoto as MediaPhotoEntity
from src.infrastructure.database.postgres.repositories import PostgresMediaPhotoRepository
from src.infrastructure.database.postgres.repositories.user_repository import UserRepository


ONE_PIXEL_PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
)


@pytest.mark.integration
@pytest.mark.asyncio
async def test_create_saves_complete_png_bytes(database):
    user_id = uuid.uuid4()
    session_id = uuid.uuid4()
    await UserRepository(database).upsert(user_id, f"photo-{user_id}@example.com")
    async with database.session_scope() as db_session:
        db_session.add(Session(id=session_id, user_id=user_id, title="photo upload"))

    try:
        saved = await PostgresMediaPhotoRepository(database).create_photo(
            user_id,
            MediaPhotoEntity(
                session_id=session_id,
                content=ONE_PIXEL_PNG,
                media_type="image/png",
                metadata={"source": "file", "filename": "pixel.png"},
            ),
        )

        assert saved is not None
        async with database.session_scope() as db_session:
            row = await db_session.scalar(select(MediaPhoto).where(MediaPhoto.id == saved.id))
            assert row is not None
            assert row.content == ONE_PIXEL_PNG
            assert row.media_type == "image/png"
            assert row.metadata_["filename"] == "pixel.png"
    finally:
        async with database.session_scope() as db_session:
            user = await db_session.get(User, user_id)
            if user:
                await db_session.delete(user)
