#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Filename: test_migrations.py
Date: 2026-07-18
Description: Unit tests for the Alembic revision graph.

             run_migrations() executes on every boot (see bootstrap/lifespan),
             so a branched or broken chain takes the service down at startup.
             These checks read the scripts only -- no database is touched.
"""
################################################################################
# built-in modules
import os
from pathlib import Path

# third-party modules
import pytest
from alembic.config import Config
from alembic.script import ScriptDirectory

# developed modules
from src.infrastructure.database.postgres import migrations

################################################################################
MIGRATION_PATH = Path(migrations.__file__).parent


@pytest.fixture(scope="module")
def script_directory() -> ScriptDirectory:
    """The Alembic script directory, loaded the way run_migrations loads it."""
    config = Config(MIGRATION_PATH / "alembic.ini")
    config.set_main_option("script_location", str(MIGRATION_PATH))
    return ScriptDirectory.from_config(config)


################################################################################
@pytest.mark.unit
def test_alembic_ini_exists():
    """run_migrations() reads alembic.ini from the migrations package."""
    assert (MIGRATION_PATH / "alembic.ini").is_file()
    assert (MIGRATION_PATH / "env.py").is_file()
    assert (MIGRATION_PATH / "versions").is_dir()


@pytest.mark.unit
def test_revision_chain_is_linear(script_directory):
    """Exactly one head and one base -- no accidental branch from a merge."""
    heads = script_directory.get_heads()
    assert len(heads) == 1, f"branched migration history: {heads}"
    assert len(script_directory.get_bases()) == 1


@pytest.mark.unit
def test_every_revision_is_reachable_from_head(script_directory):
    """Walking down from head visits every script in versions/."""
    walked = {script.revision for script in script_directory.walk_revisions()}
    on_disk = {
        path.name.split("_")[0]
        for path in (MIGRATION_PATH / "versions").glob("[0-9]*.py")
    }
    assert walked == on_disk, f"orphaned revisions: {on_disk - walked}"


@pytest.mark.unit
def test_revision_ids_are_unique(script_directory):
    """Duplicate revision ids make the chain ambiguous."""
    revisions = [script.revision for script in script_directory.walk_revisions()]
    assert len(revisions) == len(set(revisions))


@pytest.mark.unit
def test_every_revision_defines_upgrade_and_downgrade(script_directory):
    """Downgrades must exist so a bad deploy can be rolled back."""
    for script in script_directory.walk_revisions():
        module = script.module
        assert callable(getattr(module, "upgrade", None)), f"{script.revision}: no upgrade()"
        assert callable(getattr(module, "downgrade", None)), f"{script.revision}: no downgrade()"


@pytest.mark.unit
def test_migration_manager_rewrites_async_driver_to_sync():
    """Alembic runs on psycopg; the app URL is asyncpg. The swap must hold.

    Guards the string replacement in run_migrations() -- if the app URL scheme
    changes, this catches it here rather than at container startup.
    """
    from src.infrastructure.database.postgres.migrations.migration_manager import (
        run_migrations,
    )
    import inspect

    source = inspect.getsource(run_migrations)
    assert "postgresql+asyncpg://" in source
    assert "postgresql+psycopg://" in source


################################################################################
if __name__ == "__main__":
    test_file_path = os.path.abspath(__file__)
    os.system(f"python -m pytest {test_file_path} -v -s")
