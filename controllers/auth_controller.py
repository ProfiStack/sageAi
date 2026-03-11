from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from sqlalchemy.orm import Session

from core.security import bcrypt_context, create_access_token
from models.db_models import UserProfile
from schemas.auth import LoginRequest, AccessTokenResponse


async def login_user(data: LoginRequest, db: Session) -> AccessTokenResponse:
    if not data.email and not data.phone_number or not data.password:
        raise HTTPException(status_code=400, detail="Please enter correct details.")

    query = db.query(UserProfile)

    if data.email:
        profile = query.filter_by(email=data.email).first()
    else:
        profile = query.filter_by(phone_number=data.phone_number).first()

    if profile and profile.hashed_password:
        if not bcrypt_context.verify(data.password, profile.hashed_password):
            raise HTTPException(status_code=401, detail="Please enter correct password")
        profile.last_active = datetime.now(timezone.utc)
        db.commit()
        return create_access_token(
            profile.email or profile.phone_number,
            profile.user_id,
            profile.name,
            profile.subscription_status,
            timedelta(days=1),
        )

    if profile and not profile.hashed_password:
        profile.hashed_password = bcrypt_context.hash(data.password)
        profile.last_active = datetime.now(timezone.utc)
        db.commit()
        return create_access_token(
            profile.email or profile.phone_number,
            profile.user_id,
            profile.name,
            profile.subscription_status,
            timedelta(days=1),
        )

    # Create new user if not found
    new_profile = UserProfile(
        email=data.email,
        hashed_password=bcrypt_context.hash(data.password),
        phone_number=data.phone_number,
        created_at=datetime.now(timezone.utc),
        last_active=datetime.now(timezone.utc),
        name=data.name,
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return create_access_token(
        new_profile.email or new_profile.phone_number,
        new_profile.user_id,
        new_profile.name,
        new_profile.subscription_status,
        timedelta(days=1),
    )
