import logging

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_token
from app.database.mongo import mongo

logger = logging.getLogger(__name__)

bearer_scheme = HTTPBearer()


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    payload = decode_token(credentials.credentials)
    email = payload.get("sub")
    token_type = payload.get("type")
    if not email or token_type != "access":
        logger.warning(
            "auth_failed_invalid_token",
            extra={"email": email, "token_type": token_type},
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    user = await mongo.db.users.find_one({"email": email})
    if not user or user.get("role") != "admin":
        logger.warning(
            "auth_failed_not_admin",
            extra={"email": email, "user_exists": user is not None},
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    logger.debug("auth_success", extra={"email": email})
    return user
