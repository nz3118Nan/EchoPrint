from pathlib import Path

from alembic import command
from alembic.config import Config

from src.shared import config as app_config


def run_migrations() -> None:
    migration_path = Path(__file__).parent
    config = Config(migration_path / "alembic.ini")
    config.set_main_option("script_location", str(migration_path))
    config.set_main_option(
        "sqlalchemy.url",
        app_config.system_config_setting.database.sql.connection.url.replace("postgresql+asyncpg://", "postgresql+psycopg://"),
    )
    command.upgrade(config, "head")
