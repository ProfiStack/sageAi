from typing import Annotated
from fastapi import APIRouter, Depends, UploadFile, File, Form

from core.security import get_current_user
from controllers.analysis_controller import analyze_skin, analyze_shade_matching

router = APIRouter()
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.post("/user/analyze/skin-photo")
async def skin_photo(
    user_db: user_dependency,
    image: UploadFile = File(..., description="The image to analyze"),
    consent: bool = Form(False),
):
    return await analyze_skin(user_db, image, consent)


@router.post("/user/analyze/shade-matching")
async def shade_matching(
    user_db: user_dependency,
    image: UploadFile = File(..., description="The image to analyze"),
    consent: bool = Form(False),
):
    return await analyze_shade_matching(user_db, image, consent)
