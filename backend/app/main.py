from contextlib import asynccontextmanager

from bson import ObjectId
from fastapi import FastAPI
from fastapi.encoders import ENCODERS_BY_TYPE
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database.mongo import mongo
from app.api.router import api_router

ENCODERS_BY_TYPE[ObjectId] = str


@asynccontextmanager
async def lifespan(app: FastAPI):
    await mongo.connect()
    yield
    await mongo.disconnect()


app = FastAPI(
    title="SMA Blog API",
    version="1.0.0",
    lifespan=lifespan,
    redirect_slashes=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/health")
async def health():
    databases = await mongo.client.list_database_names()
    return {"status": "ok", "database": mongo.db.name, "databases": databases}
