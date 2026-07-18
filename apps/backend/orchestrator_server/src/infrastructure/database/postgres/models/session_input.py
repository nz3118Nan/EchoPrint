import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Integer, LargeBinary, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from src.infrastructure.database.postgres.models.base import UUIDBase


class Session(UUIDBase):
    __tablename__ = "session"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), index=True)
    title: Mapped[str | None] = mapped_column(String(128))
    started_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    ended_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class MediaPhoto(UUIDBase):
    __tablename__ = "media_photo"

    session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("session.id", ondelete="CASCADE"), index=True)
    content: Mapped[bytes] = mapped_column(LargeBinary)
    media_type: Mapped[str] = mapped_column(String(64))
    captured_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class MediaMessage(UUIDBase):
    __tablename__ = "media_message"

    session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("session.id", ondelete="CASCADE"), index=True)
    content: Mapped[str] = mapped_column(Text)
    input_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class MediaVoice(UUIDBase):
    __tablename__ = "media_voice"

    session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("session.id", ondelete="CASCADE"), index=True)
    content: Mapped[bytes] = mapped_column(LargeBinary)
    media_type: Mapped[str] = mapped_column(String(64))
    duration_ms: Mapped[int | None] = mapped_column(Integer)
    recorded_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class MapTrace(UUIDBase):
    __tablename__ = "map_trace"

    session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("session.id", ondelete="CASCADE"), index=True)
    latitude: Mapped[Decimal] = mapped_column(Numeric(9, 6))
    longitude: Mapped[Decimal] = mapped_column(Numeric(9, 6))
    accuracy_meters: Mapped[Decimal | None] = mapped_column(Numeric(8, 2))
    recorded_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
