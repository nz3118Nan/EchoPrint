#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Filename: test_supabase.py
Date: 2026-07-18
Description: Unit tests for SupabaseTokenVerifier.

             Only the JWKS network lookup is stubbed; signature, issuer,
             audience and expiry are checked by real PyJWT against a real ES256
             keypair. Stubbing jwt.decode instead would assert nothing about the
             security properties this class exists to enforce.
"""
################################################################################
# built-in modules
import os
import uuid
from datetime import timedelta

# third-party modules
import jwt
import pytest

# developed modules
from src.infrastructure.auth.supabase import SupabaseTokenVerifier
from tests.fixtures.auth.fake_token_verifier import (
    SAMPLE_ISSUER,
    SAMPLE_JWKS_URL,
    SAMPLE_SUPABASE_URL,
    FakeSigningKey,
    generate_ec_key,
    issue_token,
)

################################################################################
@pytest.fixture
def ec_key():
    """A P-256 keypair shared by the tests in this module."""
    return generate_ec_key()


@pytest.fixture
def verifier(ec_key, monkeypatch):
    """A verifier whose JWKS lookup resolves to the local public key."""
    instance = SupabaseTokenVerifier(SAMPLE_SUPABASE_URL, SAMPLE_JWKS_URL)
    monkeypatch.setattr(
        instance.jwks_client,
        "get_signing_key_from_jwt",
        lambda token: FakeSigningKey(ec_key.public_key()),
    )
    return instance


################################################################################
@pytest.mark.unit
def test_issuer_is_derived_from_supabase_url():
    """The issuer the verifier enforces is <supabase_url>/auth/v1."""
    instance = SupabaseTokenVerifier(SAMPLE_SUPABASE_URL, SAMPLE_JWKS_URL)
    assert instance.issuer == f"{SAMPLE_SUPABASE_URL}/auth/v1"


@pytest.mark.unit
def test_verify_returns_subject_uuid_and_email(verifier, ec_key):
    """A well-formed token yields (UUID, email)."""
    subject = uuid.uuid4()
    token = issue_token(ec_key, subject=str(subject), email="walker@example.com")

    user_id, email = verifier.verify(token)

    assert user_id == subject
    assert isinstance(user_id, uuid.UUID)
    assert email == "walker@example.com"


@pytest.mark.unit
def test_verify_rejects_token_signed_by_another_key(verifier):
    """A token signed by a key that is not in the JWKS is rejected."""
    attacker_key = generate_ec_key()
    token = issue_token(attacker_key, subject=str(uuid.uuid4()))

    with pytest.raises(jwt.InvalidSignatureError):
        verifier.verify(token)


@pytest.mark.unit
def test_verify_rejects_foreign_issuer(verifier, ec_key):
    """A correctly signed token from another Supabase project is rejected."""
    token = issue_token(
        ec_key,
        subject=str(uuid.uuid4()),
        issuer="https://evil-project.supabase.co/auth/v1",
    )

    with pytest.raises(jwt.InvalidIssuerError):
        verifier.verify(token)


@pytest.mark.unit
def test_verify_rejects_wrong_audience(verifier, ec_key):
    """Only the `authenticated` audience is accepted."""
    token = issue_token(ec_key, subject=str(uuid.uuid4()), audience="anon")

    with pytest.raises(jwt.InvalidAudienceError):
        verifier.verify(token)


@pytest.mark.unit
def test_verify_rejects_expired_token(verifier, ec_key):
    """Expiry is enforced."""
    token = issue_token(
        ec_key,
        subject=str(uuid.uuid4()),
        expires_in=timedelta(hours=-1),
    )

    with pytest.raises(jwt.ExpiredSignatureError):
        verifier.verify(token)


@pytest.mark.unit
def test_verify_raises_key_error_when_email_claim_missing(verifier, ec_key):
    """A token with no email claim raises KeyError -- caught as 401 by the API."""
    token = issue_token(ec_key, subject=str(uuid.uuid4()), omit_email=True)

    with pytest.raises(KeyError):
        verifier.verify(token)


@pytest.mark.unit
def test_verify_raises_value_error_when_subject_is_not_a_uuid(verifier, ec_key):
    """A non-UUID subject raises ValueError -- caught as 401 by the API."""
    token = issue_token(ec_key, subject="not-a-uuid")

    with pytest.raises(ValueError):
        verifier.verify(token)


@pytest.mark.unit
def test_verify_rejects_unsigned_token(verifier, ec_key):
    """The `alg: none` downgrade attack is refused."""
    token = jwt.encode(
        {
            "sub": str(uuid.uuid4()),
            "email": "walker@example.com",
            "iss": SAMPLE_ISSUER,
            "aud": "authenticated",
        },
        key=None,
        algorithm="none",
    )

    with pytest.raises(jwt.PyJWTError):
        verifier.verify(token)


################################################################################
if __name__ == "__main__":
    test_file_path = os.path.abspath(__file__)
    os.system(f"python -m pytest {test_file_path} -v -s")
