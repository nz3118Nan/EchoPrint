from typing import Annotated

from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel
import jwt

from src.container import Container
from src.infrastructure.auth.supabase import SupabaseTokenVerifier
from src.infrastructure.database.postgres.repositories.user_repository import UserRepository

router = APIRouter()


class UserResponse(BaseModel):
    id: str
    email: str


Verifier = Annotated[SupabaseTokenVerifier, Depends(Provide[Container.supabase_token_verifier])]
Users = Annotated[UserRepository, Depends(Provide[Container.user_repository])]


@router.post("/sync", response_model=UserResponse)
@inject
async def sync_user(
    authorization: Annotated[str | None, Header()],
    verifier: Verifier,
    users: Users,
) -> UserResponse:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    try:
        user_id, email = verifier.verify(authorization.removeprefix("Bearer "))
    except (KeyError, ValueError, jwt.PyJWTError) as error:
        raise HTTPException(status_code=401, detail="Invalid access token") from error
    user = await users.upsert(user_id, email)
    return UserResponse(id=str(user.id), email=user.email)
