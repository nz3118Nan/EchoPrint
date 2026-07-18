#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Filename: conftest.py
Date: 2026-07-18
Description: Shared pytest fixtures.

             Upstream runs its integration suite inside docker-compose, where
             Postgres is guaranteed up, so it lets connection errors fail hard.
             EchoPrint devs also run pytest on the host, where the database is
             often absent -- so `database` skips instead of erroring. Unit tests
             never touch this fixture and always run.
"""
################################################################################
# built-in modules
import asyncio

# third-party modules
import pytest
import pytest_asyncio
from sqlalchemy import text

# developed modules
from src.infrastructure.database.postgres.connection import AsyncSqlDatabase
from tests.base_test import resolve_database_url

################################################################################
@pytest_asyncio.fixture
async def database():
    """A live AsyncSqlDatabase, or skip the test when Postgres is unreachable."""
    db = AsyncSqlDatabase(resolve_database_url())
    try:
        async with asyncio.timeout(5):
            async with db.session_scope() as session:
                await session.execute(text("SELECT 1"))
    except Exception as error:  # noqa: BLE001 - any connect failure means "no DB"
        await db.dispose()
        pytest.skip(f"Postgres unavailable at {resolve_database_url()}: {error}")

    try:
        yield db
    finally:
        await db.dispose()
