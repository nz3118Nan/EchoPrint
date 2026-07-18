from typing import Annotated

import jwt
from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends, Header, HTTPException

from src.application.dto.media import MessageCreate, MessageCreateResponse
from src.container import Container
from src.domain.media import MediaMessage, MediaMessageRepository
from src.infrastructure.auth.supabase import SupabaseTokenVerifier

router = APIRouter()

Verifier = Annotated[SupabaseTokenVerifier, Depends(Provide[Container.supabase_token_verifier])]
Messages = Annotated[MediaMessageRepository, Depends(Provide[Container.media_message_repository])]


@router.post("", response_model=MessageCreateResponse, status_code=201)
@inject
async def create_message(
    body: MessageCreate,
    authorization: Annotated[str | None, Header()],
    verifier: Verifier,
    messages: Messages,
) -> MessageCreateResponse:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    try:
        user_id, _ = verifier.verify(authorization.removeprefix("Bearer "))
    except (KeyError, ValueError, jwt.PyJWTError) as error:
        raise HTTPException(status_code=401, detail="Invalid access token") from error

    saved = await messages.create_message(
        user_id,
        MediaMessage(session_id=body.session_id, content=body.content.strip()),
    )
    if saved is None:
        raise HTTPException(status_code=404, detail="Session not found")
    assert saved.id is not None
    return MessageCreateResponse(id=saved.id, session_id=saved.session_id, content=saved.content)
