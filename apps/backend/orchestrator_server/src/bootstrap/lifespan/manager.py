from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.container import container
from src.infrastructure.database.postgres.migrations.migration_manager import run_migrations


@asynccontextmanager
async def create_lifespan(_: FastAPI):
    """Blueprint-style startup order: container, migrations, then request handling."""
    container.init_resources()
    run_migrations()
    try:
        yield
    finally:
        database = container.database()
        redis = container.redis()
        await database.dispose()
        await redis.close()
        container.shutdown_resources()
