from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from src.infrastructure.database.postgres.models.base import UUIDBase


class User(UUIDBase):
    __tablename__ = "user"

    email: Mapped[str] = mapped_column(String(64), unique=True, index=True)
