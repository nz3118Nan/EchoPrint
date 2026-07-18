import io
import uuid
import pytest
from fastapi import HTTPException, UploadFile

from src.api.photos import MAX_PHOTO_BYTES, upload_photo
from src.application.dto.media import PhotoUploadResponse
from src.domain.media import MediaPhoto
from tests.fixtures.auth.fake_token_verifier import FakeTokenVerifier


class FakePhotoRepository:
    def __init__(self, found: bool = True) -> None:
        self.found = found
        self.create_calls = []

    async def create_photo(self, user_id, photo):
        self.create_calls.append((user_id, photo))
        if not self.found:
            return None
        return MediaPhoto(
            id=uuid.uuid4(),
            session_id=photo.session_id,
            content=photo.content,
            media_type=photo.media_type,
            metadata=photo.metadata,
        )


def image_upload(content=b"\x89PNG\r\n\x1a\n", content_type="image/png"):
    return UploadFile(filename="trail.png", file=io.BytesIO(content), headers={"content-type": content_type})


@pytest.mark.unit
@pytest.mark.asyncio
async def test_upload_photo_passes_complete_image_to_repository():
    session_id = uuid.uuid4()
    user_id = uuid.uuid4()
    photos = FakePhotoRepository()

    result = await upload_photo(
        session_id=session_id,
        source="file",
        photo=image_upload(),
        authorization="Bearer token",
        verifier=FakeTokenVerifier(user_id=user_id),
        photos=photos,
    )

    assert isinstance(result, PhotoUploadResponse)
    assert result.size == 8
    called_user_id, called_photo = photos.create_calls[0]
    assert called_user_id == user_id
    assert called_photo == MediaPhoto(
        session_id=session_id,
        content=b"\x89PNG\r\n\x1a\n",
        media_type="image/png",
        metadata={"source": "file", "filename": "trail.png"},
    )


@pytest.mark.unit
@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("upload", "status"),
    [
        (image_upload(b"", "image/png"), 400),
        (image_upload(b"plain text", "text/plain"), 415),
        (image_upload(b"x" * (MAX_PHOTO_BYTES + 1), "image/jpeg"), 413),
    ],
)
async def test_upload_photo_rejects_invalid_files(upload, status):
    with pytest.raises(HTTPException) as exc_info:
        await upload_photo(
            session_id=uuid.uuid4(),
            source="camera",
            photo=upload,
            authorization="Bearer token",
            verifier=FakeTokenVerifier(),
            photos=FakePhotoRepository(),
        )

    assert exc_info.value.status_code == status


@pytest.mark.unit
@pytest.mark.asyncio
async def test_upload_photo_hides_sessions_not_owned_by_user():
    with pytest.raises(HTTPException) as exc_info:
        await upload_photo(
            session_id=uuid.uuid4(),
            source="file",
            photo=image_upload(),
            authorization="Bearer token",
            verifier=FakeTokenVerifier(),
            photos=FakePhotoRepository(found=False),
        )

    assert exc_info.value.status_code == 404
