from pydantic import BaseModel


class SiteSettingsSchema(BaseModel):
    featured_post_slug: str = ""
    quote_text: str = "All models are wrong, but some are useful."
    quote_attribution: str = "George Box, Statistician"
    edition_label: str = "Vol. I No. 12"
    edition_date: str = ""


class SiteSettingsUpdate(BaseModel):
    featured_post_slug: str | None = None
    quote_text: str | None = None
    quote_attribution: str | None = None
    edition_label: str | None = None
    edition_date: str | None = None
