import uuid

import pytest

from src.api.sessions import create_session
from src.application.dto.session import CreateSessionResponse
from src.domain.session import Session
from tests.fixtures.auth.fake_token_verifier import FakeTokenVerifier


class FakeSessionRepository:
    async def create_session(self, user_id, title=None):
        return Session(id=uuid.uuid4(), user_id=user_id, title=title)


@pytest.mark.unit
@pytest.mark.asyncio
async def test_create_session_uses_authenticated_user():
    user_id = uuid.uuid4()
    result = await create_session(
        authorization="Bearer token",
        verifier=FakeTokenVerifier(user_id=user_id),
        sessions=FakeSessionRepository(),
    )
    assert isinstance(result, CreateSessionResponse)
    assert result.title == "Today's trace"
