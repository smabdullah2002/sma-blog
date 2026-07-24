import logging

from fastapi import APIRouter, HTTPException, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database.mongo import mongo
from app.schemas.auth import LoginRequest, TokenResponse, RefreshRequest
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(request: Request, body: LoginRequest):
    client_ip = request.client.host if request.client else "unknown"
    logger.info("login_attempt", extra={"email": body.email, "client_ip": client_ip})
    user = await mongo.db.users.find_one({"email": body.email})
    if not user or not verify_password(body.password, user["password_hash"]):
        logger.warning(
            "login_failed",
            extra={
                "email": body.email,
                "reason": "invalid_credentials",
                "client_ip": client_ip,
            },
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    logger.info("login_success", extra={"email": body.email, "client_ip": client_ip})
    return TokenResponse(
        access_token=create_access_token(user["email"]),
        refresh_token=create_refresh_token(user["email"]),
    )


@router.post("/refresh", response_model=TokenResponse)
@limiter.limit("10/minute")
async def refresh(request: Request, body: RefreshRequest):
    logger.info("refresh_attempt")
    payload = decode_token(body.refresh_token)
    email = payload.get("sub")
    if not email or payload.get("type") != "refresh":
        logger.warning(
            "refresh_failed",
            extra={"reason": "invalid_refresh_token", "email": email},
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
    user = await mongo.db.users.find_one({"email": email})
    if not user:
        logger.warning(
            "refresh_failed",
            extra={"reason": "user_not_found", "email": email},
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    logger.info("refresh_success", extra={"email": email})
    return TokenResponse(
        access_token=create_access_token(email),
        refresh_token=create_refresh_token(email),
    )
