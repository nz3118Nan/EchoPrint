#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Filename: base_test.py
Date: 2026-07-18
Description: Base test class for managing async database resources.

             Ported from the Blueprint AI Agent Service (tests/base_test.py).
             Two deliberate deviations from upstream:
               1. Upstream resolves the engine through a global
                  `db_connection_pool`; EchoPrint composes through the DI
                  container, so this class owns an AsyncSqlDatabase directly.
               2. Upstream hand-rolls event-loop setup/teardown in
                  setup_class/teardown_class. pytest-asyncio >= 1.0 owns the
                  loop lifecycle, so that block is dropped -- keeping it would
                  fight the plugin and leak loops.
"""
################################################################################
# built-in modules
import os
from typing import Optional

# third-party modules
from pytest_asyncio import fixture

# developed modules
from src.infrastructure.database.postgres.connection import AsyncSqlDatabase
from src.shared import config

################################################################################
#: Fallback used when DATABASE_URL is unset -- matches docker-compose defaults
#: with the host-published port from the repo-root docker-compose.yml.
DEFAULT_TEST_DATABASE_URL = (
    "postgresql+asyncpg://echoprint:echoprint@localhost:5450/echoprint"
)


def resolve_database_url() -> str:
    """Resolve the database URL for tests.

    `config.yaml` interpolates ${DATABASE_URL} via os.path.expandvars, which
    leaves the literal placeholder in place when the variable is unset. Detect
    that case and fall back to the local compose defaults.
    """
    url = config.system_config_setting.database.sql.connection.url
    if url.startswith("${") or not url:
        return os.environ.get("DATABASE_URL", DEFAULT_TEST_DATABASE_URL)
    return url


################################################################################
class BaseAsyncTest:
    """Base class for async tests with database resource management."""

    _database: Optional[AsyncSqlDatabase] = None

    @classmethod
    async def init_database(cls) -> AsyncSqlDatabase:
        """Initialize the database connection if needed."""
        if cls._database is None:
            cls._database = AsyncSqlDatabase(resolve_database_url())
        return cls._database

    @classmethod
    async def cleanup_database(cls) -> None:
        """Dispose the engine and release pooled connections."""
        if cls._database is not None:
            await cls._database.dispose()
            cls._database = None

    @property
    def database(self) -> AsyncSqlDatabase:
        """The database initialized by the autouse fixture."""
        assert self._database is not None, "database not initialized"
        return self._database

    @fixture(autouse=True)
    async def setup_and_teardown(self):
        """Handle setup and teardown for each test."""
        # Setup
        await self.init_database()

        yield

        # Teardown
        await self.cleanup_database()
