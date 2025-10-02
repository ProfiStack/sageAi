# routers/profile.py
from datetime import datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.schemas import UserProfileRequest, UserProfileResponse
from models.db_models import ChatMessage, Payment
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
    profile = get_or_create_user_profile(db, user_db.get("user_id"))
    all_payments = db.query(Payment).filter(Payment.user_id == user_db.get("user_id")).all()
    # Use a list comprehension to get all payment types
    payment_types = [payment.type for payment in all_payments if payment.type]

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
        last_active=profile.last_active.isoformat(),
        makeup_goal=profile.makeup_goal or "Unknown",
        nutrition_goal=profile.nutrition_goal or "Unknown",
        dietary_restriction=profile.dietary_restriction or "Unknown",
        wellness_focus=profile.wellness_focus or "Unknown",
        dedicate_time=profile.dedicate_time or "Unknown",
        hair_type=profile.hair_type or "Unknown",
        hair_concern=profile.hair_concern or "Unknown",
        style_preference=profile.style_preference or "Unknown",
        styling_goal=profile.styling_goal or "Unknown",
        subscription_status=profile.subscription_status,
        payment_types=payment_types,
        free_scan=profile.free_scan
    )


@router.post("/user/profile")
async def update_profile(
    profile_data: UserProfileRequest,
    user_db: user_dependency,
    db: Session = Depends(get_db),
):
    updated_profile = await update_user_profile(
        db, user_db.get("user_id"), profile_data.model_dump(exclude_unset=True)
    )
    return {
        "message": "Profile updated successfully",
        "user_id": user_db.get("user_id"),
        "profile": {
            "email": updated_profile.email,
            "phone_number": updated_profile.phone_number,
            "gender": updated_profile.gender,
            "skin_type": updated_profile.skin_type,
            "name": updated_profile.name,
            "age": updated_profile.age,
            "lifestyle": updated_profile.lifestyle,
            "concern": updated_profile.concern,
            "makeup_goal": updated_profile.makeup_goal,
            "preferred_routine": updated_profile.preferred_routine,
            "nutrition_goal": updated_profile.nutrition_goal,
            "dietary_restriction": updated_profile.dietary_restriction,
            "wellness_focus": updated_profile.wellness_focus,
            "dedicate_time": updated_profile.dedicate_time,
            "hair_type": updated_profile.hair_type,
            "hair_concern": updated_profile.hair_concern,
            "style_preference": updated_profile.style_preference,
            "styling_goal": updated_profile.styling_goal,
            "last_active": updated_profile.last_active.isoformat(),
        },
    }
