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
        skin_type=profile.skin_type or "Unknown",
        lifestyle=profile.lifestyle or "Unknown",
        concern=profile.concern or "Unknown",
        preferred_routine=profile.preferred_routine or "Unknown",
        created_at=profile.created_at.isoformat(),
        last_active=profile.last_active.isoformat()
    )

@router.post("/user/{user_id}/profile")
def update_profile(user_id: str, profile_data: UserProfileRequest, db: Session = Depends(get_db)):
    update_user_profile(db, user_id, profile_data.dict(exclude_unset=True))
    return {"message": "Profile updated successfully", "user_id": user_id}


@router.get("/user/{user_id}/history")
def get_chat_history_by_type(user_id: str, db: Session = Depends(get_db), limit: int = 20):
    history = db.query(ChatMessage)\
                .filter_by(user_id=user_id)\
                .order_by(ChatMessage.timestamp.desc())\
                .limit(limit)\
                .all()
    
    return {
        "user_id": user_id,
        "history": [
            {
                "message": chat.message,
                "response": chat.response,
                "timestamp": chat.timestamp,
                "type": chat.type
            } for chat in history
        ]
    }


@router.get("/user/{user_id}/history/{type}")
def get_chat_history_by_type(user_id: str, type: str, db: Session = Depends(get_db), limit: int = 20):
    history = db.query(ChatMessage)\
                .filter_by(user_id=user_id, type=type)\
                .order_by(ChatMessage.timestamp.desc())\
                .limit(limit)\
                .all()
    
    return {
        "user_id": user_id,
        "type": type,
        "history": [
            {
                "message": chat.message,
                "response": chat.response,
                "timestamp": chat.timestamp
            } for chat in history
        ]
    }