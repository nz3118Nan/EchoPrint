#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Filename: test_loader.py
Date: 2026-07-18
Description: Unit tests for ConfigLoader and the config schema.

             Mirrors the upstream config tests. ConfigLoader caches a process-
             wide singleton, so tests that need a re-read reset `_instance`
             explicitly and restore it afterwards via monkeypatch.
"""
################################################################################
# built-in modules
import os
from pathlib import Path

# third-party modules
import pytest
from pydantic import ValidationError

# developed modules
from src.shared import config as loaded_config
from src.shared.configuration.loader import PROJECT_ROOT, ConfigLoader
from src.shared.configuration.schema import Model

################################################################################
CONFIG_PATH = PROJECT_ROOT / "src/shared/configuration/system/config.yaml"


@pytest.fixture
def fresh_loader(monkeypatch):
    """Clear the cached singleton for one test, then restore it."""
    monkeypatch.setattr(ConfigLoader, "_instance", None)
    return ConfigLoader


################################################################################
@pytest.mark.unit
def test_project_root_resolves_to_the_server_package():
    """PROJECT_ROOT must point at orchestrator_server, not src/ or the repo root."""
    assert (PROJECT_ROOT / "pyproject.toml").is_file()
    assert (PROJECT_ROOT / "src").is_dir()
    assert CONFIG_PATH.is_file(), f"config.yaml not found at {CONFIG_PATH}"


@pytest.mark.unit
def test_create_returns_a_validated_model():
    """The shipped config.yaml satisfies the schema."""
    assert isinstance(loaded_config, Model)
    settings = loaded_config.system_config_setting
    assert settings.database.sql.connection.url
    assert settings.database.redis.url
    assert settings.auth.supabase.url
    assert settings.auth.supabase.jwks_url
    assert settings.database.sql.db_schema.echoprint_service.table_name.User == "user"


@pytest.mark.unit
def test_create_is_a_cached_singleton():
    """Repeated calls hand back the same object -- config is read once."""
    assert ConfigLoader.create() is ConfigLoader.create()
    assert ConfigLoader.create() is loaded_config


@pytest.mark.unit
def test_environment_variables_are_interpolated(fresh_loader, monkeypatch):
    """${VAR} placeholders in config.yaml are expanded from the environment."""
    monkeypatch.setenv("DATABASE_URL", "postgresql+asyncpg://u:p@db:5432/echoprint")
    monkeypatch.setenv("REDIS_URL", "redis://cache:6379/1")
    monkeypatch.setenv("SUPABASE_URL", "https://unit-test.supabase.co")
    monkeypatch.setenv(
        "SUPABASE_JWKS_URL", "https://unit-test.supabase.co/auth/v1/.well-known/jwks.json"
    )

    settings = fresh_loader.create().system_config_setting

    assert settings.database.sql.connection.url == "postgresql+asyncpg://u:p@db:5432/echoprint"
    assert settings.database.redis.url == "redis://cache:6379/1"
    assert settings.auth.supabase.url == "https://unit-test.supabase.co"
    assert "jwks.json" in settings.auth.supabase.jwks_url


@pytest.mark.unit
def test_table_name_matches_the_orm_tablename():
    """Config and the ORM must agree on the user table name."""
    from src.infrastructure.database.postgres.models import User

    configured = loaded_config.system_config_setting.database.sql.db_schema
    assert configured.echoprint_service.table_name.User == User.__tablename__


@pytest.mark.unit
def test_schema_rejects_incomplete_config():
    """A missing section is a startup-time failure, not a None at runtime."""
    with pytest.raises(ValidationError):
        Model.model_validate({"system_config_setting": {"database": {}}})


@pytest.mark.unit
def test_schema_rejects_missing_auth_section():
    """Auth config is mandatory -- the service cannot verify tokens without it."""
    with pytest.raises(ValidationError):
        Model.model_validate(
            {
                "system_config_setting": {
                    "database": {
                        "sql": {
                            "connection": {"url": "postgresql://x"},
                            "db_schema": {
                                "echoprint_service": {"table_name": {"User": "user"}}
                            },
                        },
                        "redis": {"url": "redis://x"},
                    }
                }
            }
        )


################################################################################
if __name__ == "__main__":
    test_file_path = os.path.abspath(__file__)
    os.system(f"python -m pytest {test_file_path} -v -s")
