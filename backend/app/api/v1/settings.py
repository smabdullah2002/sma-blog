from fastapi import APIRouter, Depends
from app.api.deps import get_current_admin
from app.database.mongo import mongo
from app.schemas.settings import SiteSettingsSchema, SiteSettingsUpdate

router = APIRouter(prefix="/settings", tags=["settings"])

DEFAULT = {
    "featured_post_slug": "",
    "quote_text": "All models are wrong, but some are useful.",
    "quote_attribution": "George Box, Statistician",
    "edition_label": "Vol. I No. 12",
    "edition_date": "",
}


async def _get_settings():
    doc = await mongo.db.settings.find_one({"key": "site"})
    if doc:
        return {k: doc.get(k, DEFAULT[k]) for k in DEFAULT}
    return dict(DEFAULT)


@router.get("")
async def get_settings():
    return await _get_settings()


@router.put("")
async def update_settings(body: SiteSettingsUpdate, admin=Depends(get_current_admin)):
    update = {k: v for k, v in body.model_dump().items() if v is not None}
    if not update:
        return await _get_settings()
    await mongo.db.settings.update_one(
        {"key": "site"},
        {"$set": update},
        upsert=True,
    )
    return await _get_settings()
