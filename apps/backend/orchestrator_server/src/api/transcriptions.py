from collections.abc import AsyncIterator
from typing import Annotated

import jwt
from dependency_injector.wiring import Provide, inject
from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    Header,
    HTTPException,
    UploadFile,
    WebSocket,
    WebSocketDisconnect,
)

from src.application.dto.media import VoiceUpload, VoiceUploadResponse
from src.container import Container
from src.domain.media import MediaVoice, MediaVoiceRepository
from src.infrastructure.auth.supabase import SupabaseTokenVerifier
from src.infrastructure.transcription.openai import (
    OpenAITranscriptionService,
    TranscriptionNotConfiguredError,
)

router = APIRouter()


Transcriber = Annotated[
    OpenAITranscriptionService,
    Depends(Provide[Container.transcription_service]),
]
Verifier = Annotated[SupabaseTokenVerifier, Depends(Provide[Container.supabase_token_verifier])]
Voices = Annotated[MediaVoiceRepository, Depends(Provide[Container.media_voice_repository])]

MAX_AUDIO_BYTES = 10 * 1024 * 1024
ALLOWED_AUDIO_TYPES = {
    "audio/flac",
    "audio/m4a",
    "audio/mp4",
    "audio/mpeg",
    "audio/ogg",
    "audio/wav",
    "audio/webm",
    "audio/x-m4a",
}


@router.post("/batch", response_model=VoiceUploadResponse, status_code=201)
@inject
async def transcribe_batch(
    session_id: Annotated[str, Form()],
    duration_ms: Annotated[int, Form(ge=0)],
    audio: Annotated[UploadFile, File(description="Audio to transcribe")],
    authorization: Annotated[str | None, Header()],
    transcriber: Transcriber,
    verifier: Verifier,
    voices: Voices,
) -> VoiceUploadResponse:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    try:
        user_id, _ = verifier.verify(authorization.removeprefix("Bearer "))
    except (KeyError, ValueError, jwt.PyJWTError) as error:
        raise HTTPException(status_code=401, detail="Invalid access token") from error

    if audio.content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(status_code=415, detail="Unsupported audio type")
    content = await audio.read(MAX_AUDIO_BYTES + 1)
    if not content:
        raise HTTPException(status_code=400, detail="Empty audio")
    if len(content) > MAX_AUDIO_BYTES:
        raise HTTPException(status_code=413, detail="Audio exceeds 10 MB")

    upload = VoiceUpload(
        session_id=session_id,
        filename=audio.filename or "recording.m4a",
        media_type=audio.content_type,
        duration_ms=duration_ms,
        content=content,
    )
    saved = await voices.create_voice(
        user_id,
        MediaVoice(
            session_id=upload.session_id,
            content=upload.content,
            media_type=upload.media_type,
            duration_ms=upload.duration_ms,
            metadata={"filename": upload.filename},
        ),
    )
    if saved is None:
        raise HTTPException(status_code=404, detail="Session not found")
    assert saved.id is not None
    try:
        transcript = await transcriber.transcribe_batch(
            filename=upload.filename,
            content=upload.content,
            content_type=upload.media_type,
        )
    except TranscriptionNotConfiguredError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    saved = await voices.set_transcript(saved.id, transcript)
    return VoiceUploadResponse(
        id=saved.id,
        session_id=saved.session_id,
        media_type=saved.media_type,
        size=len(saved.content),
        duration_ms=saved.duration_ms,
        transcript=transcript,
    )


async def _browser_messages(websocket: WebSocket) -> AsyncIterator[str]:
    while True:
        yield await websocket.receive_text()


@router.websocket("/realtime")
@inject
async def transcribe_realtime(
    websocket: WebSocket,
    transcriber: Transcriber,
) -> None:
    await websocket.accept()
    try:
        async for event in transcriber.realtime_events(_browser_messages(websocket)):
            await websocket.send_json(event)
    except TranscriptionNotConfiguredError as error:
        await websocket.send_json({"type": "error", "detail": str(error)})
        await websocket.close(code=1011)
    except WebSocketDisconnect:
        return
    except Exception:
        await websocket.close(code=1011)
