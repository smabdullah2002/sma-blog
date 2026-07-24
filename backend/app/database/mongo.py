import logging
from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

logger = logging.getLogger(__name__)


class MongoManager:
    client: AsyncIOMotorClient | None = None
    db = None

    async def connect(self):
        try:
            self.client = AsyncIOMotorClient(settings.mongodb_uri)
            self.db = self.client.get_default_database("blog")
            logger.info("mongo_connected", extra={"database_name": self.db.name})
            await self._ensure_indexes()
            await self._seed_admin()
        except Exception:
            logger.error("mongo_connect_error", exc_info=True)
            raise

    async def disconnect(self):
        if self.client:
            self.client.close()
            logger.info("mongo_disconnected")

    async def _ensure_indexes(self):
        try:
            await self.db.users.create_index("email", unique=True)
            await self.db.posts.create_index("slug", unique=True)
            await self.db.posts.create_index("tags.slug")
            await self.db.posts.create_index("status")
            await self.db.settings.create_index("key", unique=True)
            logger.info("indexes_ensured")
        except Exception:
            logger.warning("index_creation_error", exc_info=True)

    async def _seed_admin(self):
        try:
            existing = await self.db.users.find_one({"email": settings.admin_email})
            if not existing:
                from app.core.security import hash_password
                await self.db.users.insert_one({
                    "email": settings.admin_email,
                    "password_hash": hash_password(settings.admin_password),
                    "name": "Admin",
                    "role": "admin",
                    "created_at": datetime.now(timezone.utc),
                })
                logger.info("admin_seeded", extra={"email": settings.admin_email})
            else:
                logger.debug("admin_exists", extra={"email": settings.admin_email})
        except Exception:
            logger.error("admin_seed_error", exc_info=True)
            raise


mongo = MongoManager()
