import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database.mongo import mongo
from app.schemas.newsletter import SubscribeRequest, SubscribeResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/newsletter", tags=["newsletter"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/subscribe")
@limiter.limit("3/minute")
async def subscribe(request: Request, body: SubscribeRequest):
    client_ip = request.client.host if request.client else "unknown"
    logger.info(
        "newsletter_subscribe_attempt",
        extra={"email": body.email, "client_ip": client_ip},
    )
    try:
        existing = await mongo.db.subscribers.find_one({"email": body.email})
        if existing:
            logger.info("newsletter_already_subscribed", extra={"email": body.email})
            return SubscribeResponse(message="You're already subscribed.")
        await mongo.db.subscribers.insert_one({
            "email": body.email,
            "subscribed_at": datetime.now(timezone.utc).isoformat(),
            "source": "homepage",
        })
        logger.info("newsletter_subscribed", extra={"email": body.email, "source": "homepage"})
        return SubscribeResponse(message="Thanks for subscribing! Check your inbox.")
    except Exception:
        logger.error("newsletter_subscribe_error", exc_info=True, extra={"email": body.email})
        raise
