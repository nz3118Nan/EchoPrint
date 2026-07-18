"""remove redundant session started time

Revision ID: 0006
Revises: 0005
"""

import sqlalchemy as sa
from alembic import op

revision = "0006"
down_revision = "0005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_column("session", "started_time")


def downgrade() -> None:
    op.add_column("session", sa.Column("started_time", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False))
