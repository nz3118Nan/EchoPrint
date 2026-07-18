#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Filename: test_models.py
Date: 2026-07-18
Description: Unit tests for the ORM mapping.

             Ported in spirit from the Blueprint AI Agent Service model tests.
             These assert the mapping only -- no database required. They exist
             because a drifted column name or a dropped ON DELETE CASCADE fails
             silently at runtime and only shows up as orphaned rows.
"""
################################################################################
# built-in modules
import os
import uuid

# third-party modules
import pytest
from sqlalchemy import Boolean, DateTime, LargeBinary, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID

# developed modules
from src.infrastructure.database.postgres.models import (
    Base,
    MapTrace,
    MediaMessage,
    MediaPhoto,
    MediaVoice,
    Session,
    User,
)

################################################################################
SESSION_INPUT_MODELS = [MediaPhoto, MediaMessage, MediaVoice, MapTrace]
ALL_MODELS = [User, Session, *SESSION_INPUT_MODELS]


################################################################################
# Shared UUIDBase contract
################################################################################
@pytest.mark.unit
@pytest.mark.parametrize("model", ALL_MODELS, ids=lambda m: m.__tablename__)
def test_models_inherit_uuid_base_columns(model):
    """Every table carries the shared id / timestamps / is_active columns."""
    columns = model.__table__.columns
    for name in ("id", "created_time", "updated_time", "is_active"):
        assert name in columns, f"{model.__tablename__} is missing {name}"

    assert isinstance(columns["id"].type, PGUUID)
    assert columns["id"].primary_key is True
    assert isinstance(columns["created_time"].type, DateTime)
    assert columns["created_time"].type.timezone is True
    assert isinstance(columns["updated_time"].type, DateTime)
    assert columns["updated_time"].type.timezone is True
    assert isinstance(columns["is_active"].type, Boolean)
    assert columns["is_active"].index is True


@pytest.mark.unit
@pytest.mark.parametrize("model", ALL_MODELS, ids=lambda m: m.__tablename__)
def test_id_defaults_to_a_fresh_uuid(model):
    """id is client-generated via uuid4, so inserts do not need a RETURNING id."""
    default = model.__table__.columns["id"].default
    assert default is not None
    generated = default.arg(None)
    assert isinstance(generated, uuid.UUID)
    assert generated != default.arg(None), "uuid default must not be constant"


@pytest.mark.unit
def test_all_models_share_one_metadata_registry():
    """Every table is registered on the single Base -- Alembic autogenerate
    only sees tables reachable from Base.metadata."""
    registered = set(Base.metadata.tables)
    expected = {model.__tablename__ for model in ALL_MODELS}
    assert expected.issubset(registered), f"unregistered: {expected - registered}"


################################################################################
# User
################################################################################
@pytest.mark.unit
def test_user_table_shape():
    """user.email is a unique, indexed, 64-char column."""
    assert User.__tablename__ == "user"
    email = User.__table__.columns["email"]
    assert isinstance(email.type, String)
    assert email.type.length == 64
    assert email.unique is True
    assert email.index is True
    assert email.nullable is False


################################################################################
# Session
################################################################################
@pytest.mark.unit
def test_session_belongs_to_user_with_cascade():
    """Deleting a user removes their sessions."""
    assert Session.__tablename__ == "session"
    user_id = Session.__table__.columns["user_id"]
    foreign_key = next(iter(user_id.foreign_keys))
    assert foreign_key.target_fullname == "user.id"
    assert foreign_key.ondelete == "CASCADE"
    assert user_id.index is True


@pytest.mark.unit
def test_session_optional_columns_are_nullable():
    """title and ended_time are unset while a walk is still in progress."""
    columns = Session.__table__.columns
    assert columns["title"].nullable is True
    assert columns["title"].type.length == 128
    assert columns["ended_time"].nullable is True


@pytest.mark.unit
def test_session_start_is_tracked_by_created_time():
    """There is no `started_time` column -- revision 0004 dropped the explicit
    event times, so `created_time` from UUIDBase is the session start."""
    columns = Session.__table__.columns
    assert "started_time" not in columns
    assert columns["created_time"].server_default is not None


################################################################################
# Session inputs
################################################################################
@pytest.mark.unit
@pytest.mark.parametrize("model", SESSION_INPUT_MODELS, ids=lambda m: m.__tablename__)
def test_session_inputs_cascade_from_session(model):
    """Deleting a session removes every input captured during it."""
    session_id = model.__table__.columns["session_id"]
    foreign_key = next(iter(session_id.foreign_keys))
    assert foreign_key.target_fullname == "session.id"
    assert foreign_key.ondelete == "CASCADE"
    assert session_id.index is True


@pytest.mark.unit
@pytest.mark.parametrize(
    "model", [Session, *SESSION_INPUT_MODELS], ids=lambda m: m.__tablename__
)
def test_metadata_attribute_maps_to_metadata_column(model):
    """`metadata_` is stored as JSONB under the column name `metadata`.

    The trailing underscore exists only to dodge SQLAlchemy's reserved
    `metadata` attribute -- the database column must not inherit it.
    """
    columns = model.__table__.columns
    assert "metadata" in columns
    assert "metadata_" not in columns
    assert isinstance(columns["metadata"].type, JSONB)
    assert model.metadata_.key == "metadata_"
    assert model.metadata_.expression.name == "metadata"


@pytest.mark.unit
def test_media_payload_column_types():
    """Binary media is stored as bytes; text messages as unbounded text."""
    assert isinstance(MediaPhoto.__table__.columns["content"].type, LargeBinary)
    assert isinstance(MediaVoice.__table__.columns["content"].type, LargeBinary)
    assert isinstance(MediaMessage.__table__.columns["content"].type, Text)
    assert MediaVoice.__table__.columns["duration_ms"].nullable is True


@pytest.mark.unit
def test_map_trace_coordinate_precision():
    """Coordinates use Numeric(9, 6) -- ~11cm resolution, no float drift."""
    columns = MapTrace.__table__.columns
    for name in ("latitude", "longitude"):
        column_type = columns[name].type
        assert isinstance(column_type, Numeric)
        assert (column_type.precision, column_type.scale) == (9, 6)
        assert columns[name].nullable is False

    accuracy = columns["accuracy_meters"]
    assert isinstance(accuracy.type, Numeric)
    assert (accuracy.type.precision, accuracy.type.scale) == (8, 2)
    assert accuracy.nullable is True


################################################################################
if __name__ == "__main__":
    test_file_path = os.path.abspath(__file__)
    os.system(f"python -m pytest {test_file_path} -v -s")
