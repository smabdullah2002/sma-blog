from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings


class MongoManager:
    client: AsyncIOMotorClient | None = None
    db = None

    async def connect(self):
        self.client = AsyncIOMotorClient(settings.mongodb_uri)
        self.db = self.client.get_default_database("blog")
        await self._ensure_indexes()
        await self._seed_admin()

    async def disconnect(self):
        if self.client:
            self.client.close()

    async def _ensure_indexes(self):
        await self.db.users.create_index("email", unique=True)
        await self.db.posts.create_index("slug", unique=True)
        await self.db.posts.create_index("tags.slug")
        await self.db.posts.create_index("status")
        await self.db.settings.create_index("key", unique=True)

    async def _seed_admin(self):
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


mongo = MongoManager()
