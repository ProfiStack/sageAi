# routers/profile.py
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.schemas import UserProfileRequest, UserProfileResponse
from models.db_models import ChatMessage
from routers.auth import get_current_user
from services.db_service import get_or_create_user_profile, update_user_profile
from db import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

user_dependency = Annotated[Session, Depends(get_current_user)]

@router.get("/user/profile", response_model=UserProfileResponse)
def get_profile(user_db: user_dependency, db: Session = Depends(get_db)):
    profile = get_or_create_user_profile(db, user_db.get('user_id'))
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")
    return UserProfileResponse(
        user_id=profile.user_id,
        name=profile.name or "User",
        age=profile.age,
        gender=profile.gender,
        skin_type=profile.skin_type or "Unknown",
        lifestyle=profile.lifestyle or "Unknown",
        concern=profile.concern or "Unknown",
        preferred_routine=profile.preferred_routine or "Unknown",
        created_at=profile.created_at.isoformat(),
        last_active=profile.last_active.isoformat()
    )

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


@router.post("/user/profile")
def update_profile(profile_data: UserProfileRequest, user_db: user_dependency, db: Session = Depends(get_db)):
    updated_profile = update_user_profile(db, user_db.get('user_id'), profile_data.dict(exclude_unset=True))
    return {
        "message": "Profile updated successfully",
        "user_id": user_db.get('user_id'),
        "profile": {
            "email": updated_profile.email,
            "phone_number": updated_profile.phone_number,
            "gender": updated_profile.gender,
            "skin_type": updated_profile.skin_type,
            "name": updated_profile.name,
            "age": updated_profile.age,
            "lifestyle": updated_profile.lifestyle,
            "concern": updated_profile.concern,
            "preferred_routine": updated_profile.preferred_routine,
            "last_active": updated_profile.last_active.isoformat(),
        }
    }

