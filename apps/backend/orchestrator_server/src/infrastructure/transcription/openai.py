import asyncio
import json
from collections.abc import AsyncIterator

import websockets
from openai import AsyncOpenAI


class TranscriptionNotConfiguredError(RuntimeError):
    pass


class OpenAITranscriptionService:
    REALTIME_URL = "wss://api.openai.com/v1/realtime?intent=transcription"

    def __init__(
        self,
        api_key: str,
        batch_model: str = "gpt-4o-transcribe",
        realtime_model: str = "gpt-4o-transcribe",
    ) -> None:
        self.api_key = api_key.strip()
        self.batch_model = batch_model
        self.realtime_model = realtime_model
        self._client = AsyncOpenAI(api_key=self.api_key) if self.api_key else None

    def _require_api_key(self) -> None:
        if not self.api_key:
            raise TranscriptionNotConfiguredError(
                "OPENAI_API_KEY is not configured on the backend"
            )

    async def transcribe_batch(
        self, filename: str, content: bytes, content_type: str | None
    ) -> str:
        self._require_api_key()
        assert self._client is not None
        result = await self._client.audio.transcriptions.create(
            model=self.batch_model,
            file=(filename, content, content_type or "application/octet-stream"),
        )
        return result.text

    async def realtime_events(
        self, browser_messages: AsyncIterator[str]
    ) -> AsyncIterator[dict]:
        """Proxy base64 PCM16 chunks to OpenAI and yield normalized events."""
        self._require_api_key()
        headers = {"Authorization": f"Bearer {self.api_key}"}

        async with websockets.connect(
            self.REALTIME_URL, additional_headers=headers
        ) as openai_ws:
            await openai_ws.send(
                json.dumps(
                    {
                        "type": "session.update",
                        "session": {
                            "type": "transcription",
                            "audio": {
                                "input": {
                                    "format": {"type": "audio/pcm", "rate": 24000},
                                    "transcription": {"model": self.realtime_model},
                                    "turn_detection": {
                                        "type": "server_vad",
                                        "threshold": 0.5,
                                        "prefix_padding_ms": 300,
                                        "silence_duration_ms": 500,
                                    },
                                }
                            },
                        },
                    }
                )
            )

            async def forward_audio() -> None:
                async for raw in browser_messages:
                    message = json.loads(raw)
                    if message.get("type") == "audio_chunk":
                        await openai_ws.send(
                            json.dumps(
                                {
                                    "type": "input_audio_buffer.append",
                                    "audio": message.get("audio", ""),
                                }
                            )
                        )
                    elif message.get("type") == "stop":
                        await openai_ws.send(
                            json.dumps({"type": "input_audio_buffer.commit"})
                        )
                        return

            producer = asyncio.create_task(forward_audio())
            try:
                async for raw in openai_ws:
                    event = json.loads(raw)
                    event_type = event.get("type", "")
                    if event_type.endswith(".delta"):
                        yield {
                            "type": "transcript_delta",
                            "item_id": event.get("item_id"),
                            "delta": event.get("delta", ""),
                        }
                    elif event_type.endswith(".completed"):
                        yield {
                            "type": "transcript_done",
                            "item_id": event.get("item_id"),
                            "transcript": event.get("transcript", ""),
                        }
                        if producer.done():
                            return
                    elif event_type == "error":
                        yield {"type": "error", "detail": event}
            finally:
                producer.cancel()
