#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Filename: test_auth.py
Date: 2026-07-18
Description: Unit tests for the POST /auth/sync handler.

             Follows the upstream convention of calling the handler directly
             with test doubles rather than going through HTTP, so the auth
             branches are asserted without a container, a database, or Supabase.
"""
################################################################################
# built-in modules
import os
import uuid

# third-party modules
import jwt
import pytest
from fastapi import HTTPException

# developed modules
from src.api.auth import UserResponse, sync_user
from tests.fixtures.auth.fake_token_verifier import FakeTokenVerifier
from tests.fixtures.user.fake_user_repository import FakeUserRepository

################################################################################
@pytest.mark.unit
@pytest.mark.asyncio
async def test_sync_user_upserts_and_returns_identity():
    """A valid bearer token upserts the user and echoes back id + email."""
    user_id = uuid.uuid4()
    verifier = FakeTokenVerifier(user_id=user_id, email="walker@example.com")
    users = FakeUserRepository()

    result = await sync_user(
        authorization="Bearer valid-token",
        verifier=verifier,
        users=users,
    )

    assert isinstance(result, UserResponse)
    assert result.id == str(user_id)
    assert result.email == "walker@example.com"
    # The scheme prefix is stripped before the token reaches the verifier.
    assert verifier.verify_calls == ["valid-token"]
    assert users.upsert_calls == [(user_id, "walker@example.com")]


@pytest.mark.unit
@pytest.mark.asyncio
@pytest.mark.parametrize(
    "authorization",
    [
        pytest.param(None, id="missing_header"),
        pytest.param("", id="empty_header"),
        pytest.param("valid-token", id="no_scheme"),
        pytest.param("Basic dXNlcjpwYXNz", id="wrong_scheme"),
        pytest.param("bearer valid-token", id="lowercase_scheme"),
    ],
)
async def test_sync_user_rejects_malformed_authorization(authorization):
    """Anything that is not a `Bearer ` header is a 401, before any I/O."""
    verifier = FakeTokenVerifier()
    users = FakeUserRepository()

    with pytest.raises(HTTPException) as exc_info:
        await sync_user(authorization=authorization, verifier=verifier, users=users)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Missing bearer token"
    # Rejected before touching Supabase or the database.
    assert verifier.verify_calls == []
    assert users.upsert_calls == []


@pytest.mark.unit
@pytest.mark.asyncio
@pytest.mark.parametrize(
    "error",
    [
        pytest.param(jwt.ExpiredSignatureError("expired"), id="expired"),
        pytest.param(jwt.InvalidSignatureError("bad signature"), id="bad_signature"),
        pytest.param(jwt.InvalidIssuerError("wrong issuer"), id="wrong_issuer"),
        pytest.param(jwt.InvalidAudienceError("wrong audience"), id="wrong_audience"),
        pytest.param(jwt.DecodeError("malformed"), id="malformed"),
        pytest.param(KeyError("email"), id="missing_email_claim"),
        pytest.param(ValueError("badly formed uuid"), id="bad_subject_uuid"),
    ],
)
async def test_sync_user_maps_verification_failures_to_401(error):
    """Every failure mode the handler catches surfaces as a 401, not a 500."""
    verifier = FakeTokenVerifier(raise_on_verify=error)
    users = FakeUserRepository()

    with pytest.raises(HTTPException) as exc_info:
        await sync_user(
            authorization="Bearer broken-token",
            verifier=verifier,
            users=users,
        )

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Invalid access token"
    # A token that fails verification must never reach the database.
    assert users.upsert_calls == []


@pytest.mark.unit
@pytest.mark.asyncio
async def test_sync_user_does_not_swallow_repository_errors():
    """Database faults propagate as 500s -- they are not auth failures."""
    verifier = FakeTokenVerifier()
    users = FakeUserRepository(raise_on_upsert=RuntimeError("connection reset"))

    with pytest.raises(RuntimeError, match="connection reset"):
        await sync_user(
            authorization="Bearer valid-token",
            verifier=verifier,
            users=users,
        )


@pytest.mark.unit
@pytest.mark.asyncio
async def test_sync_user_is_idempotent_for_repeated_calls():
    """Calling sync twice keeps a single user row -- the upsert contract."""
    user_id = uuid.uuid4()
    verifier = FakeTokenVerifier(user_id=user_id, email="walker@example.com")
    users = FakeUserRepository()

    first = await sync_user("Bearer t1", verifier=verifier, users=users)
    second = await sync_user("Bearer t2", verifier=verifier, users=users)

    assert first == second
    assert len(users.users) == 1
    assert len(users.upsert_calls) == 2


################################################################################
if __name__ == "__main__":
    test_file_path = os.path.abspath(__file__)
    os.system(f"python -m pytest {test_file_path} -v -s")
