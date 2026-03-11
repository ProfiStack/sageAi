from datetime import datetime
from sqlalchemy.orm import Session

from models.db_models import UserProfile


def get_or_create_user_profile(db: Session, user_id: str) -> UserProfile:
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


def get_all_user_profiles(db: Session):
    return db.query(UserProfile).all()


async def update_user_profile(db: Session, user_id: str, updates: dict) -> UserProfile:
    profile = get_or_create_user_profile(db, user_id)
    for k, v in updates.items():
        if hasattr(profile, k):
            setattr(profile, k, v)
        else:
            print(f"Warning: UserProfile has no attribute '{k}'")
    profile.last_active = datetime.utcnow()
    db.flush()
    db.commit()
    db.refresh(profile)
    return profile


def update_user_session_metrics(db: Session, user_id: str, **kwargs):
    profile = get_or_create_user_profile(db, user_id)
    for key in ["skin_type", "lifestyle", "concern", "preferred_routine"]:
        if key in kwargs and kwargs[key] is not None:
            setattr(profile, key, kwargs[key])
    profile.last_active = datetime.utcnow()
    db.commit()
