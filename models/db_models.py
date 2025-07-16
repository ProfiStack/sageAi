import uuid
from datetime import datetime
from sqlalchemy import Column, String, JSON, DateTime, TEXT, UniqueConstraint
from db import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=True)
    phone_number = Column(String, unique=True, nullable=True)
    gender = Column(String, nullable=True)
    skin_type = Column(String, nullable=True)
    name = Column(String, nullable=True)
    age = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    lifestyle = Column(String, nullable=True)
    hashed_password = Column(String)
    concern = Column(String, nullable=True)
    preferred_routine = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)
class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    type = Column(String)  # e.g. skincare, nutrition
    message = Column(JSON)
    response = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)

class ChatResults(Base):
    __tablename__ = "chat_results"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    chat_id = Column(String, index=True)
    results = Column(TEXT)  # e.g. skincare, nutrition
    timestamp = Column(DateTime, default=datetime.utcnow)
    __table_args__ = (
        UniqueConstraint('user_id', 'chat_id', name='uq_user_chat'),
    )