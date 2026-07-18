from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api import api_router
from src.bootstrap import create_lifespan
from src.container import container

container.wire(modules=["src.api.auth", "src.api.transcriptions"])
app = FastAPI(
    title="EchoPrint Backend",
    version="0.1.0",
    docs_url="/echoprint/api/docs",
    openapi_url="/echoprint/api/openapi.json",
    lifespan=create_lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8010"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router)
