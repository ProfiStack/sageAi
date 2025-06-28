import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
from db import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"
    user_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    skin_type = Column(String)
    lifestyle = Column(String)
    concern = Column(String)
    preferred_routine = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    message = Column(Text)
    response = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
