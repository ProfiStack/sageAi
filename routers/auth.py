from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db import SessionLocal
from models.db_models import UserProfile
from models.schemas import LoginRequest, LoginResponse
from datetime import datetime

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/auth/login", response_model=LoginResponse)
def login_user(data: LoginRequest, db: Session = Depends(get_db)):
    if not data.email and not data.phone_number:
        raise HTTPException(status_code=400, detail="Email or phone number is required.")

    query = db.query(UserProfile)

    if data.email:
        profile = query.filter_by(email=data.email).first()
    else:
        profile = query.filter_by(phone_number=data.phone_number).first()

    if profile:
        profile.last_active = datetime.utcnow()
        db.commit()
        return LoginResponse(user_id=profile.user_id, message="Login successful")

    # Create new user if not found
    new_profile = UserProfile(
        email=data.email,
        phone_number=data.phone_number,
        created_at=datetime.utcnow(),
        last_active=datetime.utcnow()
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return LoginResponse(user_id=new_profile.user_id, message="New user created and logged in")
