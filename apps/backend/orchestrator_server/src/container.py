from dependency_injector import containers, providers
import os

from src.infrastructure.database.postgres.connection import AsyncSqlDatabase
from src.infrastructure.database.redis.connection import AsyncRedisDatabase
from src.infrastructure.database.postgres.repositories.user_repository import UserRepository
from src.infrastructure.database.postgres.repositories import (
    PostgresMediaPhotoRepository,
    PostgresMediaVoiceRepository,
    PostgresSessionRepository,
)
from src.infrastructure.auth.supabase import SupabaseTokenVerifier
from src.infrastructure.transcription.openai import OpenAITranscriptionService
from src.shared import config


class Container(containers.DeclarativeContainer):
    """DI container, mirroring the Blueprint Agent service composition root."""

    database = providers.Singleton(AsyncSqlDatabase, config.system_config_setting.database.sql.connection.url)
    redis = providers.Singleton(AsyncRedisDatabase, config.system_config_setting.database.redis.url)
    user_repository = providers.Factory(UserRepository, database=database)
    media_photo_repository = providers.Factory(PostgresMediaPhotoRepository, database=database)
    media_voice_repository = providers.Factory(PostgresMediaVoiceRepository, database=database)
    session_repository = providers.Factory(PostgresSessionRepository, database=database)
    supabase_token_verifier = providers.Singleton(
        SupabaseTokenVerifier,
        config.system_config_setting.auth.supabase.url,
        config.system_config_setting.auth.supabase.jwks_url,
    )
    transcription_service = providers.Singleton(
        OpenAITranscriptionService,
        api_key=os.getenv("OPENAI_API_KEY", ""),
        batch_model=os.getenv("OPENAI_TRANSCRIPTION_MODEL", "gpt-4o-transcribe"),
        realtime_model=os.getenv(
            "OPENAI_REALTIME_TRANSCRIPTION_MODEL", "gpt-4o-transcribe"
        ),
    )


container = Container()
