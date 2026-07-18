from src.domain.media import MediaMessage as MediaMessageEntity
from src.infrastructure.database.postgres.models.session_input import MediaMessage as MediaMessageORM


def model_to_entity(model: MediaMessageORM) -> MediaMessageEntity:
    return MediaMessageEntity(
        id=model.id,
        session_id=model.session_id,
        content=model.content,
        metadata=model.metadata_,
        is_active=model.is_active,
        created_time=model.created_time,
        updated_time=model.updated_time,
    )


def entity_to_dict(entity: MediaMessageEntity) -> dict:
    return {
        "session_id": entity.session_id,
        "content": entity.content,
        "metadata_": entity.metadata,
        "is_active": entity.is_active,
    }
