from datetime import datetime

from pydantic import BaseModel


class TagSchema(BaseModel):
    slug: str
    name: str


class PostCreate(BaseModel):
    title: str
    subtitle: str = ""
    excerpt: str = ""
    content: str = ""
    cover_image: str = ""
    cover_caption: str = ""
    tags: list[TagSchema] = []
    status: str = "draft"


class PostUpdate(BaseModel):
    title: str | None = None
    subtitle: str | None = None
    excerpt: str | None = None
    content: str | None = None
    cover_image: str | None = None
    cover_caption: str | None = None
    tags: list[TagSchema] | None = None
    status: str | None = None


class PostResponse(BaseModel):
    id: str
    slug: str
    title: str
    subtitle: str
    excerpt: str
    content: str
    cover_image: str
    cover_caption: str
    tags: list[TagSchema]
    author: dict
    status: str
    published_at: str | None = None
    read_time_minutes: int
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
