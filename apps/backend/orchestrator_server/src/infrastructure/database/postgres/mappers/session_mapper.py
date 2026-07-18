from src.domain.session import Session as SessionEntity
from src.infrastructure.database.postgres.models.session_input import Session as SessionORM


def model_to_entity(model: SessionORM) -> SessionEntity:
    return SessionEntity(
        id=model.id,
        user_id=model.user_id,
        title=model.title,
        ended_time=model.ended_time,
        metadata=model.metadata_,
        is_active=model.is_active,
        created_time=model.created_time,
        updated_time=model.updated_time,
    )
