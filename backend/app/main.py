import logging
import time
from contextlib import asynccontextmanager

from bson import ObjectId
from fastapi import FastAPI, Request
from fastapi.encoders import ENCODERS_BY_TYPE
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.logging_config import setup_logging
from app.database.mongo import mongo
from app.api.router import api_router

setup_logging()
logger = logging.getLogger(__name__)

ENCODERS_BY_TYPE[ObjectId] = str

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("app_startup")
    await mongo.connect()
    yield
    await mongo.disconnect()
    logger.info("app_shutdown")


app = FastAPI(
    title="SMA Blog API",
    version="1.0.0",
    lifespan=lifespan,
    redirect_slashes=False,
)

app.state.limiter = limiter


@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    start = time.perf_counter()
    request_id = request.headers.get("x-request-id", "")
    client_ip = request.client.host if request.client else "unknown"
    method = request.method
    path = request.url.path
    logger.info(
        "request_start",
        extra={"method": method, "path": path, "client_ip": client_ip},
    )
    try:
        response = await call_next(request)
    except Exception as exc:
        duration_ms = round((time.perf_counter() - start) * 1000, 2)
        logger.error(
            "unhandled_exception",
            exc_info=True,
            extra={
                "method": method,
                "path": path,
                "client_ip": client_ip,
                "duration_ms": duration_ms,
            },
        )
        raise
    duration_ms = round((time.perf_counter() - start) * 1000, 2)
    logger.info(
        "request_end",
        extra={
            "method": method,
            "path": path,
            "client_ip": client_ip,
            "status_code": response.status_code,
            "duration_ms": duration_ms,
        },
    )
    return response


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    client_ip = request.client.host if request.client else "unknown"
    logger.warning(
        "rate_limit_exceeded",
        extra={"client_ip": client_ip, "path": request.url.path},
    )
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Please try again later."},
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
    return {"status": "ok"}
