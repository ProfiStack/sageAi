from sqlalchemy.orm import Session
from models.db_models import UserProfile, ChatMessage
from datetime import datetime

def get_or_create_user_profile(db: Session, user_id: str):
    profile = db.query(UserProfile).filter_by(user_id=user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

def update_user_profile(db: Session, user_id: str, updates: dict):
    profile = get_or_create_user_profile(db, user_id)
    for k, v in updates.items():
        setattr(profile, k, v)
    profile.last_active = datetime.utcnow()
    db.commit()
    return profile

def save_chat_message(db: Session, user_id: str,type: str, message: str, response: str):
    # Ensure user profile exists and update last_active
    profile = get_or_create_user_profile(db, user_id)
    profile.last_active = datetime.utcnow()

    # Check if a chat already exists for the user
    existing_chat = db.query(ChatMessage).filter_by(user_id=user_id, type=type).first()

    if existing_chat:
        existing_chat.message = message
        existing_chat.type = type
        existing_chat.response = response
        existing_chat.timestamp = datetime.utcnow()
    else:
        new_chat = ChatMessage(
            user_id=user_id,
            type=type,
            message=message,
            response=response,
            timestamp=datetime.utcnow()
        )
        db.add(new_chat)

    db.commit()
    return existing_chat if existing_chat else new_chat


def fetch_chat_history(db: Session, user_id: str, limit: int = 20):
    return (
        db.query(ChatMessage)
        .filter_by(user_id=user_id)
        .order_by(ChatMessage.timestamp.desc())
        .limit(limit)
        .all()
    )
