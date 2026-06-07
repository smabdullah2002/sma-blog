import math
import re
from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps import get_current_admin
from app.database.mongo import mongo
from app.schemas.post import PostCreate, PostUpdate

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

    total = await mongo.db.posts.count_documents(query)
    cursor = (
        mongo.db.posts.find(query)
        .sort("created_at", -1)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    docs = await cursor.to_list(length=limit)
    return {
        "items": [_post_doc(d) for d in docs],
        "total": total,
        "page": page,
        "pages": math.ceil(total / limit) if total else 1,
    }


@router.get("/{slug}")
async def get_post(slug: str):
    doc = await mongo.db.posts.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return _post_doc(doc)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_post(body: PostCreate, admin=Depends(get_current_admin)):
    now = datetime.now(timezone.utc).isoformat()
    slug = re.sub(r"[^a-z0-9]+", "-", body.title.lower()).strip("-")
    existing = await mongo.db.posts.find_one({"slug": slug})
    if existing:
        slug = f"{slug}-{int(datetime.now().timestamp())}"
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
    return _post_doc(doc)


@router.put("/{slug}")
async def update_post(slug: str, body: PostUpdate, admin=Depends(get_current_admin)):
    existing = await mongo.db.posts.find_one({"slug": slug})
    if not existing:
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

    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    await mongo.db.posts.update_one({"slug": slug}, {"$set": update})
    doc = await mongo.db.posts.find_one({"slug": slug})
    return _post_doc(doc)


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(slug: str, admin=Depends(get_current_admin)):
    result = await mongo.db.posts.delete_one({"slug": slug})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
