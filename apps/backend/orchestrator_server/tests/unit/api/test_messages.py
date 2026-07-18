import uuid

import pytest
from fastapi import HTTPException

from src.api.messages import create_message
from src.application.dto.media import MessageCreate
from src.domain.media import MediaMessage
from tests.fixtures.auth.fake_token_verifier import FakeTokenVerifier


class FakeMessageRepository:
    def __init__(self, found: bool = True) -> None:
        self.found = found
        self.created = []

    async def create_message(self, user_id, message):
        self.created.append((user_id, message))
        if not self.found:
            return None
        return MediaMessage(
            id=uuid.uuid4(),
            session_id=message.session_id,
            content=message.content,
            metadata=message.metadata,
        )


@pytest.mark.unit
@pytest.mark.asyncio
async def test_create_message_saves_trimmed_text_for_owned_session():
    user_id = uuid.uuid4()
    session_id = uuid.uuid4()
    repository = FakeMessageRepository()

    result = await create_message(
        body=MessageCreate(session_id=session_id, content="  A quiet path  "),
        authorization="Bearer token",
        verifier=FakeTokenVerifier(user_id=user_id),
        messages=repository,
    )

    assert result.content == "A quiet path"
    assert repository.created == [(user_id, MediaMessage(session_id=session_id, content="A quiet path"))]


@pytest.mark.unit
@pytest.mark.asyncio
async def test_create_message_hides_unowned_session():
    with pytest.raises(HTTPException) as exc_info:
        await create_message(
            body=MessageCreate(session_id=uuid.uuid4(), content="hello"),
            authorization="Bearer token",
            verifier=FakeTokenVerifier(),
            messages=FakeMessageRepository(found=False),
        )

    assert exc_info.value.status_code == 404
