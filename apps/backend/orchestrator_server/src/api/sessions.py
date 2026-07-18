import uuid
from datetime import datetime
from decimal import Decimal
from typing import Annotated

import jwt
from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select

from src.application.dto.session import CreateSessionResponse
from src.container import Container
from src.domain.session import SessionRepository
from src.infrastructure.auth.supabase import SupabaseTokenVerifier
from src.infrastructure.database.postgres.connection import AsyncSqlDatabase
from src.infrastructure.database.postgres.models.session_input import MapTrace, Session

router = APIRouter()

Verifier = Annotated[SupabaseTokenVerifier, Depends(Provide[Container.supabase_token_verifier])]
Sessions = Annotated[SessionRepository, Depends(Provide[Container.session_repository])]
Database = Annotated[AsyncSqlDatabase, Depends(Provide[Container.database])]


class TrackPoint(BaseModel):
    latitude: Decimal = Field(ge=-90, le=90)
    longitude: Decimal = Field(ge=-180, le=180)
    accuracy_meters: Decimal = Field(ge=0, le=1000)
    sampled_at: datetime


class TrackBatch(BaseModel):
    points: list[TrackPoint] = Field(min_length=1, max_length=100)


def authenticated_user(authorization: str | None, verifier: SupabaseTokenVerifier) -> uuid.UUID:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    try:
        user_id, _ = verifier.verify(authorization.removeprefix("Bearer "))
        return user_id
    except (KeyError, ValueError, jwt.PyJWTError) as error:
        raise HTTPException(status_code=401, detail="Invalid access token") from error


@router.post("", response_model=CreateSessionResponse, status_code=201)
@inject
async def create_session(
    authorization: Annotated[str | None, Header()],
    verifier: Verifier,
    sessions: Sessions,
) -> CreateSessionResponse:
    user_id = authenticated_user(authorization, verifier)
    session = await sessions.create_session(user_id, "Today's trace")
    assert session.id is not None
    return CreateSessionResponse(id=session.id, title=session.title)


@router.post("/{session_id}/track-points", status_code=201)
@inject
async def save_track_points(
    session_id: uuid.UUID,
    body: TrackBatch,
    authorization: Annotated[str | None, Header()],
    verifier: Verifier,
    database: Database,
) -> dict[str, int]:
    user_id = authenticated_user(authorization, verifier)
    async with database.session_scope() as db:
        owner = await db.scalar(select(Session.user_id).where(Session.id == session_id))
        if owner != user_id:
            raise HTTPException(status_code=404, detail="Session not found")
        db.add_all(
            MapTrace(
                session_id=session_id,
                latitude=point.latitude,
                longitude=point.longitude,
                accuracy_meters=point.accuracy_meters,
                metadata_={"sampled_at": point.sampled_at.isoformat()},
            )
            for point in body.points
        )
    return {"accepted": len(body.points)}


@router.get("/traces")
@inject
async def list_traces(
    authorization: Annotated[str | None, Header()],
    verifier: Verifier,
    database: Database,
) -> list[dict[str, object]]:
    user_id = authenticated_user(authorization, verifier)
    async with database.session_scope() as db:
        sessions = (
            await db.scalars(
                select(Session)
                .where(Session.user_id == user_id, Session.is_active.is_(True))
                .order_by(Session.created_time.desc())
            )
        ).all()
        result = []
        for trace_session in sessions:
            points = (
                await db.scalars(
                    select(MapTrace)
                    .where(MapTrace.session_id == trace_session.id, MapTrace.is_active.is_(True))
                    .order_by(MapTrace.metadata_["sampled_at"].as_string(), MapTrace.created_time)
                )
            ).all()
            result.append(
                {
                    "id": str(trace_session.id),
                    "title": trace_session.title,
                    "created_at": trace_session.created_time,
                    "points": [
                        {
                            "latitude": float(point.latitude),
                            "longitude": float(point.longitude),
                            "accuracy_meters": float(point.accuracy_meters or 0),
                            "sampled_at": point.metadata_.get("sampled_at"),
                        }
                        for point in points
                    ],
                }
            )
    return result
