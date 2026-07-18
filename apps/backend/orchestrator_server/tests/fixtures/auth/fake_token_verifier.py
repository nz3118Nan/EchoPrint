#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Filename: fake_token_verifier.py
Date: 2026-07-18
Description: Supabase token test doubles and a real ES256 signing helper.

             `FakeTokenVerifier` covers API-layer tests that only care about the
             success/failure branches. `issue_token` mints genuinely signed
             ES256 tokens so SupabaseTokenVerifier can be exercised against real
             PyJWT verification (signature, issuer, audience) with only the JWKS
             network lookup stubbed out.
"""
################################################################################
# built-in modules
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import Any

# third-party modules
import jwt
from cryptography.hazmat.primitives.asymmetric import ec

################################################################################
SAMPLE_SUPABASE_URL = "https://test-project.supabase.co"
SAMPLE_JWKS_URL = f"{SAMPLE_SUPABASE_URL}/auth/v1/.well-known/jwks.json"
SAMPLE_ISSUER = f"{SAMPLE_SUPABASE_URL}/auth/v1"


################################################################################
@dataclass
class FakeTokenVerifier:
    """Returns a canned identity, or raises a canned error."""

    user_id: uuid.UUID = field(default_factory=lambda: uuid.UUID(int=1))
    email: str = "verified@example.com"
    raise_on_verify: Exception | None = None
    verify_calls: list[str] = field(default_factory=list)

    def verify(self, token: str) -> tuple[uuid.UUID, str]:
        """Mirror SupabaseTokenVerifier.verify's signature."""
        self.verify_calls.append(token)
        if self.raise_on_verify is not None:
            raise self.raise_on_verify
        return self.user_id, self.email


################################################################################
class FakeSigningKey:
    """Mimics PyJWKClient's signing-key object, which exposes `.key`."""

    def __init__(self, key: Any) -> None:
        self.key = key


def generate_ec_key() -> ec.EllipticCurvePrivateKey:
    """A P-256 private key -- the curve Supabase uses for ES256."""
    return ec.generate_private_key(ec.SECP256R1())


def issue_token(
    private_key: ec.EllipticCurvePrivateKey,
    subject: str | None = None,
    email: str | None = "verified@example.com",
    issuer: str = SAMPLE_ISSUER,
    audience: str = "authenticated",
    expires_in: timedelta = timedelta(hours=1),
    extra_claims: dict[str, Any] | None = None,
    omit_email: bool = False,
) -> str:
    """Mint a genuinely signed ES256 token shaped like a Supabase access token."""
    now = datetime.now(timezone.utc)
    claims: dict[str, Any] = {
        "sub": subject or str(uuid.uuid4()),
        "iss": issuer,
        "aud": audience,
        "iat": now,
        "exp": now + expires_in,
    }
    if not omit_email:
        claims["email"] = email
    if extra_claims:
        claims.update(extra_claims)
    return jwt.encode(claims, private_key, algorithm="ES256")
