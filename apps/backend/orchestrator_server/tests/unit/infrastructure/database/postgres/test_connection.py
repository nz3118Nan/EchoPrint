#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Filename: test_connection.py
Date: 2026-07-18
Description: Unit tests for AsyncSqlDatabase.session_scope transaction semantics.

             The session factory is replaced with a recording double, so the
             commit-on-success / rollback-on-error contract is asserted without
             a live Postgres. The integration suite covers the same path against
             a real database.
"""
################################################################################
# built-in modules
import os

# third-party modules
import pytest

# developed modules
from src.infrastructure.database.postgres.connection import AsyncSqlDatabase

################################################################################
UNUSED_URL = "postgresql+asyncpg://unused:unused@localhost:5432/unused"


class RecordingSession:
    """Records the order of commit / rollback / close calls."""

    def __init__(self, events: list[str]) -> None:
        self.events = events

    async def __aenter__(self) -> "RecordingSession":
        self.events.append("open")
        return self

    async def __aexit__(self, exc_type, exc, tb) -> bool:
        self.events.append("close")
        return False

    async def commit(self) -> None:
        self.events.append("commit")

    async def rollback(self) -> None:
        self.events.append("rollback")


@pytest.fixture
def database(monkeypatch):
    """An AsyncSqlDatabase whose sessions are recording doubles."""
    instance = AsyncSqlDatabase(UNUSED_URL)
    events: list[str] = []
    monkeypatch.setattr(instance, "session_factory", lambda: RecordingSession(events))
    instance.events = events  # type: ignore[attr-defined]
    return instance


################################################################################
@pytest.mark.unit
def test_engine_is_configured_with_pre_ping():
    """pool_pre_ping guards against connections killed by the DB or a proxy."""
    instance = AsyncSqlDatabase(UNUSED_URL)
    assert instance.engine.pool._pre_ping is True
    assert instance.session_factory.kw["expire_on_commit"] is False


@pytest.mark.unit
@pytest.mark.asyncio
async def test_session_scope_commits_on_success(database):
    """A clean block commits, then closes."""
    async with database.session_scope() as session:
        assert isinstance(session, RecordingSession)

    assert database.events == ["open", "commit", "close"]


@pytest.mark.unit
@pytest.mark.asyncio
async def test_session_scope_rolls_back_and_reraises(database):
    """A raising block rolls back, closes, and lets the error propagate."""
    with pytest.raises(RuntimeError, match="boom"):
        async with database.session_scope():
            raise RuntimeError("boom")

    assert database.events == ["open", "rollback", "close"]
    assert "commit" not in database.events


@pytest.mark.unit
@pytest.mark.asyncio
async def test_session_scope_yields_a_fresh_session_each_time(database):
    """Scopes do not share a session, so transactions stay independent."""
    async with database.session_scope() as first:
        pass
    async with database.session_scope() as second:
        pass

    assert first is not second
    assert database.events == ["open", "commit", "close"] * 2


################################################################################
if __name__ == "__main__":
    test_file_path = os.path.abspath(__file__)
    os.system(f"python -m pytest {test_file_path} -v -s")
