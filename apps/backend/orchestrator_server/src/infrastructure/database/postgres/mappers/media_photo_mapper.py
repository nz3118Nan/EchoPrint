from src.domain.media import MediaPhoto as MediaPhotoEntity
from src.infrastructure.database.postgres.models.session_input import MediaPhoto as MediaPhotoORM


def model_to_entity(model: MediaPhotoORM) -> MediaPhotoEntity:
    return MediaPhotoEntity(
        id=model.id,
        session_id=model.session_id,
        content=model.content,
        media_type=model.media_type,
        metadata=model.metadata_,
        is_active=model.is_active,
        created_time=model.created_time,
        updated_time=model.updated_time,
    )


def entity_to_dict(entity: MediaPhotoEntity) -> dict:
    return {
        "session_id": entity.session_id,
        "content": entity.content,
        "media_type": entity.media_type,
        "metadata_": entity.metadata,
        "is_active": entity.is_active,
    }
