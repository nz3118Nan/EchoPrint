"""remove redundant input event times

Revision ID: 0004
Revises: 0003
"""

import sqlalchemy as sa
from alembic import op

revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_index("ix_map_trace_session_recorded_time", table_name="map_trace")
    op.drop_column("map_trace", "recorded_time")
    op.drop_column("media_voice", "recorded_time")
    op.drop_column("media_message", "input_time")
    op.drop_column("media_photo", "captured_time")


def downgrade() -> None:
    op.add_column("media_photo", sa.Column("captured_time", sa.DateTime(timezone=True), nullable=True))
    op.add_column("media_message", sa.Column("input_time", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False))
    op.add_column("media_voice", sa.Column("recorded_time", sa.DateTime(timezone=True), nullable=True))
    op.add_column("map_trace", sa.Column("recorded_time", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False))
    op.create_index("ix_map_trace_session_recorded_time", "map_trace", ["session_id", "recorded_time"])
