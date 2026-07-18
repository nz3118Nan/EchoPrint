from io import BytesIO
import uuid

import pytest
from fastapi import HTTPException, UploadFile

from src.api.transcriptions import transcribe_batch
from src.domain.media import MediaVoice
from src.infrastructure.transcription.openai import TranscriptionNotConfiguredError
from tests.fixtures.auth.fake_token_verifier import FakeTokenVerifier


class FakeTranscriber:
    def __init__(self, transcript: str = "A walk in the park.", error=None):
        self.transcript = transcript
        self.error = error
        self.calls = []

    async def transcribe_batch(self, filename, content, content_type):
        self.calls.append((filename, content, content_type))
        if self.error:
            raise self.error
        return self.transcript


class FakeVoiceRepository:
    def __init__(self):
        self.voice = None

    async def create_voice(self, user_id, voice):
        voice.id = uuid.uuid4()
        self.voice = voice
        return voice

    async def set_transcript(self, voice_id, transcript):
        self.voice.metadata["transcript"] = transcript
        return self.voice


def audio_upload(content=b"audio bytes", content_type="audio/mp4"):
    return UploadFile(
        filename="note.m4a",
        file=BytesIO(content),
        headers={"content-type": content_type},
    )


@pytest.mark.unit
@pytest.mark.asyncio
async def test_batch_transcription_saves_audio_and_transcript():
    service = FakeTranscriber()
    voices = FakeVoiceRepository()
    session_id = uuid.uuid4()

    result = await transcribe_batch(
        session_id=str(session_id),
        duration_ms=1200,
        audio=audio_upload(),
        authorization="Bearer token",
        transcriber=service,
        verifier=FakeTokenVerifier(),
        voices=voices,
    )

    assert result.transcript == "A walk in the park."
    assert result.session_id == session_id
    assert voices.voice == MediaVoice(
        id=result.id,
        session_id=session_id,
        content=b"audio bytes",
        media_type="audio/mp4",
        duration_ms=1200,
        metadata={"filename": "note.m4a", "transcript": "A walk in the park."},
    )
    assert service.calls == [("note.m4a", b"audio bytes", "audio/mp4")]


@pytest.mark.unit
@pytest.mark.asyncio
async def test_batch_transcription_preserves_audio_when_openai_is_unavailable():
    service = FakeTranscriber(error=TranscriptionNotConfiguredError("missing key"))
    voices = FakeVoiceRepository()

    with pytest.raises(HTTPException) as exc_info:
        await transcribe_batch(
            session_id=str(uuid.uuid4()),
            duration_ms=500,
            audio=audio_upload(),
            authorization="Bearer token",
            transcriber=service,
            verifier=FakeTokenVerifier(),
            voices=voices,
        )

    assert exc_info.value.status_code == 503
    assert voices.voice.content == b"audio bytes"
    assert "transcript" not in voices.voice.metadata
