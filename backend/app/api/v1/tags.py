import logging

from fastapi import APIRouter
from app.database.mongo import mongo

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("")
async def list_tags():
    logger.debug("list_tags")
    try:
        pipeline = [
            {"$unwind": "$tags"},
            {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
        ]
        results = await mongo.db.posts.aggregate(pipeline).to_list(length=100)
        logger.debug("tags_aggregated", extra={"count": len(results)})
        return [
            {"slug": r["_id"]["slug"], "name": r["_id"]["name"], "count": r["count"]}
            for r in results
        ]
    except Exception:
        logger.error("tags_aggregation_error", exc_info=True)
        raise
