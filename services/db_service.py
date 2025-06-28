
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
    for k,v in updates.items():
        setattr(profile, k, v)
    profile.last_active = datetime.utcnow()
    db.commit()
    return profile

def save_chat_message(db: Session, user_id: str, message: str, response: str):
    chat = ChatMessage(user_id=user_id, message=message, response=response)
    db.add(chat)
    db.commit()
    return chat

def fetch_chat_history(db: Session, user_id: str, limit: int=20):
    return db.query(ChatMessage).filter_by(user_id=user_id).order_by(ChatMessage.timestamp.desc()).limit(limit).all()
