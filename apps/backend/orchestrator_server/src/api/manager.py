from fastapi import APIRouter

from src.api.infrastructure.healthcheck import router as healthcheck_router
from src.api.auth import router as auth_router
from src.api.transcriptions import router as transcriptions_router
from src.api.photos import router as photos_router
from src.api.sessions import router as sessions_router

api_router = APIRouter(prefix="/echoprint/api")
api_router.include_router(healthcheck_router, tags=["infrastructure"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(
    transcriptions_router,
    prefix="/transcriptions",
    tags=["transcriptions"],
)
api_router.include_router(photos_router, prefix="/photos", tags=["photos"])
api_router.include_router(sessions_router, prefix="/sessions", tags=["sessions"])
