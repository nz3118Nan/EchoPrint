import uuid
from typing import Annotated, Literal

import jwt
from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, UploadFile

from src.application.dto.media import PhotoUpload, PhotoUploadResponse
from src.container import Container
from src.domain.media import MediaPhoto, MediaPhotoRepository
from src.infrastructure.auth.supabase import SupabaseTokenVerifier

router = APIRouter()

MAX_PHOTO_BYTES = 10 * 1024 * 1024
ALLOWED_MEDIA_TYPES = {"image/jpeg", "image/png", "image/heic", "image/heif"}


Verifier = Annotated[SupabaseTokenVerifier, Depends(Provide[Container.supabase_token_verifier])]
Photos = Annotated[MediaPhotoRepository, Depends(Provide[Container.media_photo_repository])]


@router.post("", response_model=PhotoUploadResponse, status_code=201)
@inject
async def upload_photo(
    session_id: Annotated[uuid.UUID, Form()],
    source: Annotated[Literal["camera", "file"], Form()],
    photo: Annotated[UploadFile, File()],
    authorization: Annotated[str | None, Header()],
    verifier: Verifier,
    photos: Photos,
) -> PhotoUploadResponse:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    try:
        user_id, _ = verifier.verify(authorization.removeprefix("Bearer "))
    except (KeyError, ValueError, jwt.PyJWTError) as error:
        raise HTTPException(status_code=401, detail="Invalid access token") from error

    if photo.content_type not in ALLOWED_MEDIA_TYPES:
        raise HTTPException(status_code=415, detail="Unsupported image type")
    content = await photo.read(MAX_PHOTO_BYTES + 1)
    if not content:
        raise HTTPException(status_code=400, detail="Empty image")
    if len(content) > MAX_PHOTO_BYTES:
        raise HTTPException(status_code=413, detail="Image exceeds 10 MB")

    upload = PhotoUpload(
        session_id=session_id,
        source=source,
        filename=photo.filename or "photo",
        media_type=photo.content_type,
        content=content,
    )
    saved = await photos.create_photo(
        user_id,
        MediaPhoto(
            session_id=upload.session_id,
            content=upload.content,
            media_type=upload.media_type,
            metadata={"source": upload.source, "filename": upload.filename},
        ),
    )
    if saved is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return PhotoUploadResponse(
        id=saved.id,
        session_id=saved.session_id,
        media_type=saved.media_type,
        size=len(saved.content),
        metadata=saved.metadata,
    )
