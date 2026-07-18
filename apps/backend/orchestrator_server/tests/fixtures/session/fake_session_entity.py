#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Filename: fake_session_entity.py
Date: 2026-07-18
Description: Session and session-input test data builders.

             Ported from the Blueprint AI Agent Service
             (tests/fixtures/session/fake_session_entity.py), reshaped for
             EchoPrint's walk-session inputs: photo, message, voice, map trace.
"""
################################################################################
# built-in modules
import uuid
from decimal import Decimal
from typing import Any

################################################################################
#: Athens Acropolis -- a stable coordinate for map-trace assertions.
SAMPLE_LATITUDE = Decimal("37.971533")
SAMPLE_LONGITUDE = Decimal("23.725749")


def create_session_dict(
    user_id: uuid.UUID | None = None,
    title: str | None = "test walk",
    metadata: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Build a session payload."""
    return {
        "id": uuid.uuid4(),
        "user_id": user_id or uuid.uuid4(),
        "title": title,
        "metadata_": metadata if metadata is not None else {},
    }


def create_media_photo_dict(session_id: uuid.UUID | None = None) -> dict[str, Any]:
    """Build a media_photo payload."""
    return {
        "id": uuid.uuid4(),
        "session_id": session_id or uuid.uuid4(),
        "content": b"\x89PNG\r\n\x1a\n fake photo bytes",
        "media_type": "image/png",
        "metadata_": {},
    }


def create_media_message_dict(session_id: uuid.UUID | None = None) -> dict[str, Any]:
    """Build a media_message payload."""
    return {
        "id": uuid.uuid4(),
        "session_id": session_id or uuid.uuid4(),
        "content": "walked past the old olive tree",
        "metadata_": {},
    }


def create_media_voice_dict(session_id: uuid.UUID | None = None) -> dict[str, Any]:
    """Build a media_voice payload."""
    return {
        "id": uuid.uuid4(),
        "session_id": session_id or uuid.uuid4(),
        "content": b"fake opus bytes",
        "media_type": "audio/ogg",
        "duration_ms": 4200,
        "metadata_": {},
    }


def create_map_trace_dict(session_id: uuid.UUID | None = None) -> dict[str, Any]:
    """Build a map_trace payload."""
    return {
        "id": uuid.uuid4(),
        "session_id": session_id or uuid.uuid4(),
        "latitude": SAMPLE_LATITUDE,
        "longitude": SAMPLE_LONGITUDE,
        "accuracy_meters": Decimal("5.50"),
        "metadata_": {},
    }
