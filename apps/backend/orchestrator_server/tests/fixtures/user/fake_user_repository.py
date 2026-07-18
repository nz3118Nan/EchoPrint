#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Filename: fake_user_repository.py
Date: 2026-07-18
Description: In-memory UserRepository stand-in for API-layer unit tests.

             Ported from the Blueprint AI Agent Service
             (tests/fixtures/user/fake_user_repository.py). Mirrors the upsert
             semantics of the real PostgresUserRepository without a database.
"""
################################################################################
# built-in modules
import uuid
from dataclasses import dataclass, field

################################################################################
@dataclass
class FakeUser:
    """Duck-typed stand-in for the User ORM model."""

    id: uuid.UUID
    email: str


@dataclass
class FakeUserRepository:
    """Records upsert calls and replays them from an in-memory dict."""

    users: dict[uuid.UUID, FakeUser] = field(default_factory=dict)
    upsert_calls: list[tuple[uuid.UUID, str]] = field(default_factory=list)
    raise_on_upsert: Exception | None = None

    async def upsert(self, user_id: uuid.UUID, email: str) -> FakeUser:
        """Insert or update, matching the ON CONFLICT DO UPDATE behaviour."""
        self.upsert_calls.append((user_id, email))
        if self.raise_on_upsert is not None:
            raise self.raise_on_upsert
        user = FakeUser(id=user_id, email=email)
        self.users[user_id] = user
        return user
