"""add extensible metadata to session inputs

Revision ID: 0005
Revises: 0004
"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0005"
down_revision = "0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    for table_name in ("session", "media_photo", "media_message", "media_voice", "map_trace"):
        op.add_column(
            table_name,
            sa.Column("metadata", postgresql.JSONB(), server_default=sa.text("'{}'::jsonb"), nullable=False),
        )


def downgrade() -> None:
    for table_name in ("map_trace", "media_voice", "media_message", "media_photo", "session"):
        op.drop_column(table_name, "metadata")
