from collections.abc import AsyncIterator
from typing import Annotated, Literal

from dependency_injector.wiring import Provide, inject
from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    WebSocket,
    WebSocketDisconnect,
)
from pydantic import BaseModel

from src.container import Container
from src.infrastructure.transcription.openai import (
    OpenAITranscriptionService,
    TranscriptionNotConfiguredError,
)

router = APIRouter()


class BatchTranscriptionResponse(BaseModel):
    mode: Literal["batch"] = "batch"
    transcript: str


Transcriber = Annotated[
    OpenAITranscriptionService,
    Depends(Provide[Container.transcription_service]),
]


@router.post("/batch", response_model=BatchTranscriptionResponse)
@inject
async def transcribe_batch(
    audio: Annotated[UploadFile, File(description="Audio to transcribe")],
    transcriber: Transcriber,
) -> BatchTranscriptionResponse:
    try:
        transcript = await transcriber.transcribe_batch(
            filename=audio.filename or "audio.webm",
            content=await audio.read(),
            content_type=audio.content_type,
        )
    except TranscriptionNotConfiguredError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    return BatchTranscriptionResponse(transcript=transcript)


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
