"""add shared baseline and session inputs

Revision ID: 0003
Revises: 0002
"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def _baseline_columns() -> list[sa.Column]:
    return [
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("created_time", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_time", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
    ]


def upgrade() -> None:
    op.alter_column("user", "created_at", new_column_name="created_time")
    op.alter_column("user", "updated_at", new_column_name="updated_time")
    op.add_column("user", sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False))
    op.create_index("ix_user_is_active", "user", ["is_active"])

    op.create_table(
        "session",
        *_baseline_columns(),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("user.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(length=128), nullable=True),
        sa.Column("started_time", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("ended_time", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_session_is_active", "session", ["is_active"])
    op.create_index("ix_session_user_id", "session", ["user_id"])

    for table_name, content_type, occurred_time in (
        ("media_photo", postgresql.BYTEA(), "captured_time"),
        ("media_voice", postgresql.BYTEA(), "recorded_time"),
    ):
        columns = _baseline_columns() + [
            sa.Column("session_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("session.id", ondelete="CASCADE"), nullable=False),
            sa.Column("content", content_type, nullable=False),
            sa.Column("media_type", sa.String(length=64), nullable=False),
        ]
        if table_name == "media_voice":
            columns.append(sa.Column("duration_ms", sa.Integer(), nullable=True))
        columns.append(sa.Column(occurred_time, sa.DateTime(timezone=True), nullable=True))
        op.create_table(table_name, *columns)
        op.create_index(f"ix_{table_name}_is_active", table_name, ["is_active"])
        op.create_index(f"ix_{table_name}_session_id", table_name, ["session_id"])

    op.create_table(
        "media_message",
        *_baseline_columns(),
        sa.Column("session_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("session.id", ondelete="CASCADE"), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("input_time", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_media_message_is_active", "media_message", ["is_active"])
    op.create_index("ix_media_message_session_id", "media_message", ["session_id"])

    op.create_table(
        "map_trace",
        *_baseline_columns(),
        sa.Column("session_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("session.id", ondelete="CASCADE"), nullable=False),
        sa.Column("latitude", sa.Numeric(9, 6), nullable=False),
        sa.Column("longitude", sa.Numeric(9, 6), nullable=False),
        sa.Column("accuracy_meters", sa.Numeric(8, 2), nullable=True),
        sa.Column("recorded_time", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_map_trace_is_active", "map_trace", ["is_active"])
    op.create_index("ix_map_trace_session_id", "map_trace", ["session_id"])
    op.create_index("ix_map_trace_session_recorded_time", "map_trace", ["session_id", "recorded_time"])


def downgrade() -> None:
    for table_name in ("map_trace", "media_message", "media_voice", "media_photo", "session"):
        op.drop_table(table_name)
    op.drop_index("ix_user_is_active", table_name="user")
    op.drop_column("user", "is_active")
    op.alter_column("user", "updated_time", new_column_name="updated_at")
    op.alter_column("user", "created_time", new_column_name="created_at")
