#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Filename: test_user_repository.py
Date: 2026-07-18
Description: UserRepository integration tests.

             Corresponds to:
               src/infrastructure/database/postgres/repositories/user_repository.py
             Ported from the Blueprint AI Agent Service
             (tests/integration/infrastructure/database/postgres/repositories/
              test_user_repository.py), reduced to the upsert surface EchoPrint
             actually exposes.

             Requires a migrated Postgres. Skipped automatically when the
             database is unreachable -- see tests/conftest.py.
"""
################################################################################
# built-in modules
import os
import uuid

# third-party modules
import pytest
import pytest_asyncio
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

# developed modules
from src.infrastructure.database.postgres.repositories.user_repository import (
    UserRepository,
)
from tests.fixtures.user.fake_user_entity import create_user_dict, create_user_email

################################################################################
class TestUserRepository:
    """Test class for UserRepository operations."""

    @pytest_asyncio.fixture
    async def user_repo(self, database):
        """A repository bound to the live test database."""
        return UserRepository(database=database)

    async def cleanup_user(self, database, user_id):
        """Remove the test user; sessions cascade via the FK."""
        async with database.session_scope() as session:
            await session.execute(
                text('DELETE FROM "user" WHERE id = :id'), {"id": user_id}
            )

    async def fetch_row(self, database, user_id):
        """Read the raw row back, bypassing the repository."""
        async with database.session_scope() as session:
            result = await session.execute(
                text(
                    'SELECT id, email, is_active, created_time, updated_time '
                    'FROM "user" WHERE id = :id'
                ),
                {"id": user_id},
            )
            return result.fetchone()

    # =========================================================================
    # Insert path
    # =========================================================================

    @pytest.mark.integration
    @pytest.mark.asyncio
    async def test_upsert_inserts_new_user(self, user_repo, database):
        """upsert() creates a row when the id is unseen."""
        user_data = create_user_dict()
        user_id, email = user_data["id"], user_data["email"]

        try:
            user = await user_repo.upsert(user_id, email)

            assert user.id == user_id
            assert user.email == email
            assert user.is_active is True

            row = await self.fetch_row(database, user_id)
            assert row is not None
            assert row.email == email
            assert row.is_active is True
            assert row.created_time is not None

        finally:
            await self.cleanup_user(database, user_id)

    @pytest.mark.integration
    @pytest.mark.asyncio
    async def test_upsert_persists_across_sessions(self, user_repo, database):
        """The insert is committed, not left in an open transaction."""
        user_data = create_user_dict()
        user_id = user_data["id"]

        try:
            await user_repo.upsert(user_id, user_data["email"])

            # A brand-new repository, hence a new session and connection.
            reread = await UserRepository(database=database).upsert(
                user_id, user_data["email"]
            )
            assert reread.id == user_id

        finally:
            await self.cleanup_user(database, user_id)

    # =========================================================================
    # Conflict / update path
    # =========================================================================

    @pytest.mark.integration
    @pytest.mark.asyncio
    async def test_upsert_updates_email_on_id_conflict(self, user_repo, database):
        """A repeat id updates the email instead of raising."""
        user_data = create_user_dict()
        user_id = user_data["id"]
        new_email = create_user_email("rotated")

        try:
            await user_repo.upsert(user_id, user_data["email"])
            updated = await user_repo.upsert(user_id, new_email)

            assert updated.id == user_id
            assert updated.email == new_email

            row = await self.fetch_row(database, user_id)
            assert row.email == new_email

        finally:
            await self.cleanup_user(database, user_id)

    @pytest.mark.integration
    @pytest.mark.asyncio
    async def test_upsert_is_idempotent(self, user_repo, database):
        """Syncing the same identity repeatedly keeps exactly one row."""
        user_data = create_user_dict()
        user_id, email = user_data["id"], user_data["email"]

        try:
            for _ in range(3):
                await user_repo.upsert(user_id, email)

            async with database.session_scope() as session:
                result = await session.execute(
                    text('SELECT COUNT(*) FROM "user" WHERE id = :id'),
                    {"id": user_id},
                )
                assert result.scalar_one() == 1

        finally:
            await self.cleanup_user(database, user_id)

    @pytest.mark.integration
    @pytest.mark.asyncio
    async def test_upsert_preserves_created_time_on_update(self, user_repo, database):
        """created_time is set once; only updated_time moves."""
        user_data = create_user_dict()
        user_id = user_data["id"]

        try:
            await user_repo.upsert(user_id, user_data["email"])
            first = await self.fetch_row(database, user_id)

            await user_repo.upsert(user_id, create_user_email("later"))
            second = await self.fetch_row(database, user_id)

            assert second.created_time == first.created_time

        finally:
            await self.cleanup_user(database, user_id)

    # =========================================================================
    # Constraints
    # =========================================================================

    @pytest.mark.integration
    @pytest.mark.asyncio
    async def test_email_uniqueness_is_enforced(self, user_repo, database):
        """Two different ids cannot claim the same email."""
        first = create_user_dict()
        second = create_user_dict(email=first["email"])

        try:
            await user_repo.upsert(first["id"], first["email"])

            with pytest.raises(IntegrityError):
                await user_repo.upsert(second["id"], second["email"])

        finally:
            await self.cleanup_user(database, first["id"])
            await self.cleanup_user(database, second["id"])

    @pytest.mark.integration
    @pytest.mark.asyncio
    async def test_sessions_cascade_when_user_is_deleted(self, user_repo, database):
        """Deleting a user removes their sessions -- no orphaned walk data."""
        user_data = create_user_dict()
        user_id = user_data["id"]
        session_id = uuid.uuid4()

        try:
            await user_repo.upsert(user_id, user_data["email"])

            async with database.session_scope() as session:
                await session.execute(
                    text(
                        "INSERT INTO session (id, user_id, title) "
                        "VALUES (:id, :user_id, :title)"
                    ),
                    {"id": session_id, "user_id": user_id, "title": "cascade test"},
                )

            await self.cleanup_user(database, user_id)

            async with database.session_scope() as session:
                result = await session.execute(
                    text("SELECT COUNT(*) FROM session WHERE id = :id"),
                    {"id": session_id},
                )
                assert result.scalar_one() == 0

        finally:
            await self.cleanup_user(database, user_id)


################################################################################
if __name__ == "__main__":
    test_file_path = os.path.abspath(__file__)
    os.system(f"python -m pytest {test_file_path} -v -s")
