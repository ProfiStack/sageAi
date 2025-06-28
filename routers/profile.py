# routers/profile.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.model import UserProfile, ProfileResponse
from services.db_service import get_or_create_user_profile, update_user_profile
from db import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/user/{user_id}/profile", response_model=ProfileResponse)
def get_profile(user_id: str, db: Session = Depends(get_db)):
    profile = get_or_create_user_profile(db, user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")
    return ProfileResponse(
        skin_type=profile.skin_type or "Unknown",
        lifestyle=profile.lifestyle or "Unknown",
        concern=profile.concern or "Unknown",
        preferred_routine=profile.preferred_routine or "Unknown",
        created_at=profile.created_at.isoformat(),
        last_active=profile.last_active.isoformat()
    )

@router.post("/user/{user_id}/profile")
def update_profile(user_id: str, profile_data: UserProfile, db: Session = Depends(get_db)):
    update_user_profile(db, user_id, profile_data.dict(exclude_unset=True))
    return {"message": "Profile updated successfully", "user_id": user_id}
