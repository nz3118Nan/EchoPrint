from typing import Annotated

import jwt
from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends, Header, HTTPException

from src.application.dto.session import CreateSessionResponse
from src.container import Container
from src.domain.session import SessionRepository
from src.infrastructure.auth.supabase import SupabaseTokenVerifier

router = APIRouter()

Verifier = Annotated[SupabaseTokenVerifier, Depends(Provide[Container.supabase_token_verifier])]
Sessions = Annotated[SessionRepository, Depends(Provide[Container.session_repository])]


@router.post("", response_model=CreateSessionResponse, status_code=201)
@inject
async def create_session(
    authorization: Annotated[str | None, Header()],
    verifier: Verifier,
    sessions: Sessions,
) -> CreateSessionResponse:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    try:
        user_id, _ = verifier.verify(authorization.removeprefix("Bearer "))
    except (KeyError, ValueError, jwt.PyJWTError) as error:
        raise HTTPException(status_code=401, detail="Invalid access token") from error
    session = await sessions.create_session(user_id, "Today's trace")
    assert session.id is not None
    return CreateSessionResponse(id=session.id, title=session.title)
