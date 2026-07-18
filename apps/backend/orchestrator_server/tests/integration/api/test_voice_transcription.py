import io
import uuid

import pytest
from fastapi import UploadFile
from sqlalchemy import select

from src.api.transcriptions import transcribe_batch
from src.infrastructure.database.postgres.models.session_input import MediaVoice
from src.infrastructure.database.postgres.models.user import User
from src.infrastructure.database.postgres.repositories import (
    PostgresMediaVoiceRepository,
    PostgresSessionRepository,
    UserRepository,
)
from tests.fixtures.auth.fake_token_verifier import FakeTokenVerifier


class FakeTranscriber:
    async def transcribe_batch(self, filename, content, content_type):
        assert content == b"complete m4a bytes"
        return "Birdsong beside the trail."


@pytest.mark.integration
@pytest.mark.asyncio
async def test_voice_upload_transcribes_and_persists_complete_audio(database):
    user_id = uuid.uuid4()
    await UserRepository(database).upsert(user_id, f"voice-{user_id}@example.com")
    trace = await PostgresSessionRepository(database).create_session(user_id, "voice test")

    try:
        result = await transcribe_batch(
            session_id=str(trace.id),
            duration_ms=1500,
            audio=UploadFile(
                filename="trail.m4a",
                file=io.BytesIO(b"complete m4a bytes"),
                headers={"content-type": "audio/mp4"},
            ),
            authorization="Bearer token",
            transcriber=FakeTranscriber(),
            verifier=FakeTokenVerifier(user_id=user_id),
            voices=PostgresMediaVoiceRepository(database),
        )

        async with database.session_scope() as db_session:
            voice = await db_session.scalar(
                select(MediaVoice).where(MediaVoice.id == result.id)
            )
            assert voice is not None
            assert voice.content == b"complete m4a bytes"
            assert voice.duration_ms == 1500
            assert voice.metadata_["transcript"] == "Birdsong beside the trail."
    finally:
        async with database.session_scope() as db_session:
            user = await db_session.get(User, user_id)
            if user:
                await db_session.delete(user)
