import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File, status
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.api.deps import get_current_admin
from app.config import settings

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True,
)

router = APIRouter(prefix="/uploads", tags=["uploads"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/image")
@limiter.limit("10/minute")
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    admin=Depends(get_current_admin),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only image files are allowed",
        )

    try:
        result = cloudinary.uploader.upload(
            file.file,
            folder="sma-blog",
            transformation=[
                {"quality": "auto", "fetch_format": "auto"},
            ],
        )
        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
            "width": result.get("width"),
            "height": result.get("height"),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}",
        )
