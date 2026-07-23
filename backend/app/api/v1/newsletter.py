from datetime import datetime, timezone

from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database.mongo import mongo
from app.schemas.newsletter import SubscribeRequest, SubscribeResponse

router = APIRouter(prefix="/newsletter", tags=["newsletter"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/subscribe")
@limiter.limit("3/minute")
async def subscribe(request: Request, body: SubscribeRequest):
    existing = await mongo.db.subscribers.find_one({"email": body.email})
    if existing:
        return SubscribeResponse(message="You're already subscribed.")
    await mongo.db.subscribers.insert_one({
        "email": body.email,
        "subscribed_at": datetime.now(timezone.utc).isoformat(),
        "source": "homepage",
    })
    return SubscribeResponse(message="Thanks for subscribing! Check your inbox.")
