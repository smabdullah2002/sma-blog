from datetime import datetime, timezone

from fastapi import APIRouter

from app.database.mongo import mongo
from app.schemas.newsletter import SubscribeRequest, SubscribeResponse

router = APIRouter(prefix="/newsletter", tags=["newsletter"])


@router.post("/subscribe")
async def subscribe(body: SubscribeRequest):
    existing = await mongo.db.subscribers.find_one({"email": body.email})
    if existing:
        return SubscribeResponse(message="You're already subscribed.")
    await mongo.db.subscribers.insert_one({
        "email": body.email,
        "subscribed_at": datetime.now(timezone.utc).isoformat(),
        "source": "homepage",
    })
    return SubscribeResponse(message="Thanks for subscribing! Check your inbox.")
