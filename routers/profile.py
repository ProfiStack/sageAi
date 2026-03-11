from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user
from schemas.user import UserProfileRequest, UserProfileResponse
from controllers.profile_controller import get_profile, update_profile

router = APIRouter()
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/user/profile", response_model=UserProfileResponse)
def profile_get(user_db: user_dependency, db: Session = Depends(get_db)):
    return get_profile(user_db, db)


@router.post("/user/profile")
async def profile_update(
    profile_data: UserProfileRequest,
    user_db: user_dependency,
    db: Session = Depends(get_db),
):
    return await update_profile(profile_data, user_db, db)
