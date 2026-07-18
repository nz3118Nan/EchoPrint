from io import BytesIO

import pytest
from fastapi import HTTPException, UploadFile

from src.api.transcriptions import transcribe_batch
from src.infrastructure.transcription.openai import TranscriptionNotConfiguredError


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


@pytest.mark.unit
@pytest.mark.asyncio
async def test_batch_transcription_returns_transcript_and_mode():
    service = FakeTranscriber()
    audio = UploadFile(
        filename="note.wav",
        file=BytesIO(b"audio bytes"),
        headers={"content-type": "audio/wav"},
    )

    result = await transcribe_batch(audio=audio, transcriber=service)

    assert result.mode == "batch"
    assert result.transcript == "A walk in the park."
    assert service.calls == [("note.wav", b"audio bytes", "audio/wav")]


@pytest.mark.unit
@pytest.mark.asyncio
async def test_batch_transcription_reports_missing_backend_key():
    service = FakeTranscriber(error=TranscriptionNotConfiguredError("missing key"))
    audio = UploadFile(filename="note.wav", file=BytesIO(b"audio bytes"))

    with pytest.raises(HTTPException) as exc_info:
        await transcribe_batch(audio=audio, transcriber=service)

    assert exc_info.value.status_code == 503
    assert exc_info.value.detail == "missing key"
