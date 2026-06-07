from fastapi import APIRouter
from app.database.mongo import mongo

router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("")
async def list_tags():
    pipeline = [
        {"$unwind": "$tags"},
        {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    results = await mongo.db.posts.aggregate(pipeline).to_list(length=100)
    return [
        {"slug": r["_id"]["slug"], "name": r["_id"]["name"], "count": r["count"]}
        for r in results
    ]
