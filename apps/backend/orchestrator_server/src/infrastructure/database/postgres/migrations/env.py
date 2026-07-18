from alembic import context
from sqlalchemy import engine_from_config, pool, text

from src.shared import config as app_config

config = context.config
config.set_main_option(
    "sqlalchemy.url",
    app_config.system_config_setting.database.sql.connection.url.replace("postgresql+asyncpg://", "postgresql+psycopg://"),
)


def run_migrations_online() -> None:
    connectable = engine_from_config(config.get_section(config.config_ini_section), prefix="sqlalchemy.", poolclass=pool.NullPool)
    with connectable.connect() as connection:
        if not connection.execute(text("SELECT pg_try_advisory_lock(8011)")).scalar():
            return
        try:
            context.configure(connection=connection)
            with context.begin_transaction():
                context.run_migrations()
        finally:
            connection.execute(text("SELECT pg_advisory_unlock(8011)"))
            connection.commit()


run_migrations_online()
