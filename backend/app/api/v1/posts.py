import logging
import math
import re
from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps import get_current_admin
from app.database.mongo import mongo
from app.schemas.post import PostCreate, PostUpdate

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/posts", tags=["posts"])


def _read_time(content: str) -> int:
    return max(1, round(len(content.split()) / 200))


def _post_doc(doc) -> dict:
    return {
        "id": str(doc["_id"]),
        "slug": doc["slug"],
        "title": doc["title"],
        "subtitle": doc.get("subtitle", ""),
        "excerpt": doc.get("excerpt", ""),
        "content": doc.get("content", ""),
        "cover_image": doc.get("cover_image", ""),
        "cover_caption": doc.get("cover_caption", ""),
        "tags": doc.get("tags", []),
        "author": doc.get("author", {"name": "Admin"}),
        "status": doc.get("status", "draft"),
        "published_at": doc.get("published_at"),
        "read_time_minutes": doc.get("read_time_minutes", 1),
        "created_at": doc.get("created_at", ""),
        "updated_at": doc.get("updated_at", ""),
    }


@router.get("")
async def list_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    tag: str | None = None,
    status: str | None = None,
):
    query = {}
    if tag:
        query["tags.slug"] = tag
    if status:
        query["status"] = status
    logger.debug(
        "list_posts",
        extra={"tag": tag, "status": status, "page": page, "limit": limit},
    )
    try:
        total = await mongo.db.posts.count_documents(query)
        cursor = (
            mongo.db.posts.find(query)
            .sort("created_at", -1)
            .skip((page - 1) * limit)
            .limit(limit)
        )
        docs = await cursor.to_list(length=limit)
        logger.debug(
            "posts_fetched",
            extra={"count": len(docs), "total": total, "page": page},
        )
        return {
            "items": [_post_doc(d) for d in docs],
            "total": total,
            "page": page,
            "pages": math.ceil(total / limit) if total else 1,
        }
    except Exception:
        logger.error("posts_list_error", exc_info=True)
        raise


@router.get("/{slug}")
async def get_post(slug: str):
    doc = await mongo.db.posts.find_one({"slug": slug})
    if not doc:
        logger.debug("post_not_found", extra={"slug": slug})
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    logger.debug("post_retrieved", extra={"slug": slug})
    return _post_doc(doc)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_post(body: PostCreate, admin=Depends(get_current_admin)):
    admin_email = admin.get("email", "unknown")
    logger.info(
        "post_create_start",
        extra={"admin_email": admin_email, "title": body.title, "status": body.status},
    )
    try:
        now = datetime.now(timezone.utc).isoformat()
        slug = re.sub(r"[^a-z0-9]+", "-", body.title.lower()).strip("-")
        existing = await mongo.db.posts.find_one({"slug": slug})
        if existing:
            slug = f"{slug}-{int(datetime.now().timestamp())}"
            logger.info("post_slug_collision", extra={"original_slug": slug, "final_slug": slug})
        doc = {
            "slug": slug,
            "title": body.title,
            "subtitle": body.subtitle,
            "excerpt": body.excerpt,
            "content": body.content,
            "cover_image": body.cover_image,
            "cover_caption": body.cover_caption,
            "tags": [t.model_dump() for t in body.tags],
            "author": {"name": "Admin"},
            "status": body.status,
            "published_at": now if body.status == "published" else None,
            "read_time_minutes": _read_time(body.content),
            "created_at": now,
            "updated_at": now,
        }
        await mongo.db.posts.insert_one(doc)
        logger.info(
            "post_created",
            extra={"slug": slug, "title": body.title, "status": body.status, "admin_email": admin_email},
        )
        return _post_doc(doc)
    except Exception:
        logger.error("post_create_error", exc_info=True, extra={"title": body.title})
        raise


@router.put("/{slug}")
async def update_post(slug: str, body: PostUpdate, admin=Depends(get_current_admin)):
    admin_email = admin.get("email", "unknown")
    logger.info("post_update_start", extra={"slug": slug, "admin_email": admin_email})
    existing = await mongo.db.posts.find_one({"slug": slug})
    if not existing:
        logger.warning("post_update_not_found", extra={"slug": slug, "admin_email": admin_email})
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    update = {}
    for field in ("title", "subtitle", "excerpt", "content", "cover_image", "cover_caption", "status"):
        val = getattr(body, field, None)
        if val is not None:
            update[field] = val
    if body.tags is not None:
        update["tags"] = [t.model_dump() if hasattr(t, "model_dump") else t for t in body.tags]
    if body.content is not None:
        update["read_time_minutes"] = _read_time(body.content)
    if body.status == "published" and not existing.get("published_at"):
        update["published_at"] = datetime.now(timezone.utc).isoformat()
        logger.info("post_published", extra={"slug": slug, "admin_email": admin_email})

    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    await mongo.db.posts.update_one({"slug": slug}, {"$set": update})
    doc = await mongo.db.posts.find_one({"slug": slug})
    logger.info("post_updated", extra={"slug": slug, "fields": list(update.keys())})
    return _post_doc(doc)


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(slug: str, admin=Depends(get_current_admin)):
    admin_email = admin.get("email", "unknown")
    logger.info("post_delete_start", extra={"slug": slug, "admin_email": admin_email})
    result = await mongo.db.posts.delete_one({"slug": slug})
    if result.deleted_count == 0:
        logger.warning("post_delete_not_found", extra={"slug": slug})
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    logger.info("post_deleted", extra={"slug": slug, "admin_email": admin_email})
