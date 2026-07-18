#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Filename: fake_user_entity.py
Date: 2026-07-18
Description: User test data builders.

             Ported from the Blueprint AI Agent Service
             (tests/fixtures/user/fake_user_entity.py), reshaped for
             EchoPrint's User model (id + email only).
"""
################################################################################
# built-in modules
import uuid
from typing import Any

################################################################################
SAMPLE_EMAIL = "echoprint-test@example.com"


def create_user_id() -> uuid.UUID:
    """A fresh random user id, so parallel tests never collide."""
    return uuid.uuid4()


def create_user_email(prefix: str = "echoprint-test") -> str:
    """A unique email that fits the User.email String(64) column."""
    return f"{prefix}-{uuid.uuid4().hex[:12]}@example.com"


def create_user_dict(
    user_id: uuid.UUID | None = None,
    email: str | None = None,
) -> dict[str, Any]:
    """Build a user payload for repository-level tests."""
    return {
        "id": user_id or create_user_id(),
        "email": email or create_user_email(),
    }
