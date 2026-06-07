from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.posts import router as posts_router
from app.api.v1.tags import router as tags_router
from app.api.v1.settings import router as settings_router
from app.api.v1.newsletter import router as newsletter_router
from app.api.v1.uploads import router as uploads_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(posts_router)
api_router.include_router(tags_router)
api_router.include_router(settings_router)
api_router.include_router(newsletter_router)
api_router.include_router(uploads_router)
