from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongodb_uri: str
    cloudinary_cloud_name: str
    cloudinary_api_key: str
    cloudinary_api_secret: str
    secret_key: str
    jwt_algorithm: str
    access_token_expire_minutes: int
    refresh_token_expire_days: int
    admin_email: str
    admin_password: str
    cors_origins: str

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
