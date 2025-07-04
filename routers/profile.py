# routers/profile.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.schemas import UserProfileRequest, UserProfileResponse
from models.db_models import ChatMessage
from services.db_service import get_or_create_user_profile, update_user_profile
from db import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/user/{user_id}/profile", response_model=UserProfileResponse)
def get_profile(user_id: str, db: Session = Depends(get_db)):
    profile = get_or_create_user_profile(db, user_id)
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

@router.post("/user/{user_id}/profile")
def update_profile(user_id: str, profile_data: UserProfileRequest, db: Session = Depends(get_db)):
    updated_profile = update_user_profile(db, user_id, profile_data.dict(exclude_unset=True))
    return {
        "message": "Profile updated successfully",
        "user_id": user_id,
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

