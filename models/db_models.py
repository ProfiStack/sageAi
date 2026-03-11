# models.py
from pickle import FALSE
import uuid
from datetime import datetime
from sqlalchemy import Boolean, Column, ForeignKey, String, JSON, DateTime, TEXT, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import expression
from core.database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=True)
    phone_number = Column(String, unique=True, nullable=True)
    gender = Column(String, nullable=True)
    skin_type = Column(String, nullable=True)
    concern = Column(String, nullable=True)
    lifestyle = Column(String, nullable=True)
    makeup_goal = Column(String, nullable=True)
    nutrition_goal = Column(String, nullable=True)
    dietary_restriction = Column(String, nullable=True)
    wellness_focus = Column(String, nullable=True)
    dedicate_time = Column(String, nullable=True)
    hair_type = Column(String, nullable=True)
    hair_concern = Column(String, nullable=True)
    style_preference = Column(String, nullable=True)
    styling_goal = Column(String, nullable=True)
    name = Column(String, nullable=True)
    age = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    hashed_password = Column(String)
    preferred_routine = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)
    subscription_status = Column(String, default="free")  # free, active, canceled
    subscription_end = Column(DateTime, nullable=True)
    payments = relationship("Payment", back_populates="user_profile")
    free_scan = Column(Boolean, default=True, server_default=expression.true())


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    type = Column(String)  # e.g. skincare, nutrition
    message = Column(JSON)
    response = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)


class HairMessage(Base):
    __tablename__ = "hair_messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    type = Column(String)
    message = Column(JSON)
    response = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)

class IngredientMessage(Base):
    __tablename__ = "ingredient_messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    type = Column(String)
    message = Column(JSON)
    response = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)


class NutritionMessage(Base):
    __tablename__ = "nutrition_messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    type = Column(String)
    message = Column(JSON)
    response = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)


class WellnessMessage(Base):
    __tablename__ = "wellness_messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    type = Column(String)
    message = Column(JSON)
    response = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)


class TrendMessage(Base):
    __tablename__ = "trend_messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    type = Column(String)
    message = Column(JSON)
    response = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)


class TreatmentMessage(Base):
    __tablename__ = "treatment_messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    type = Column(String)
    message = Column(JSON)
    response = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)

class StylingMessage(Base):
    __tablename__ = "styling_messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    type = Column(String)
    message = Column(JSON)
    response = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)


class ChatResults(Base):
    __tablename__ = "chat_results"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    chat_id = Column(String, index=True)
    results = Column(TEXT)
    timestamp = Column(DateTime, default=datetime.utcnow)
    __table_args__ = (UniqueConstraint("user_id", "chat_id", name="uq_user_chat"),)


class StaticMessages(Base):
    __tablename__ = "static_messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    message = Column(JSON)


class Payment(Base):
    __tablename__ = "payments"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('user_profiles.user_id'), index=True, nullable=False)
    amount = Column(String, nullable=True)  # stored in cents as string
    currency = Column(String, default="usd")
    status = Column(String, default="pending")  # pending, succeeded, failed
    stripe_payment_intent_id = Column(String, unique=True, nullable=FALSE)
    stripe_subscription_id = Column(String, unique=True, nullable=FALSE)
    stripe_customer_id = Column(String, nullable=False)
    description = Column(String, nullable=False)
    name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    type = Column(String)
    user_profile = relationship("UserProfile", back_populates="payments")

class UserFavourite(Base):
    __tablename__ = 'user_favourites'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('user_profiles.user_id'), index=True, nullable=False)
    user_favourites = Column(JSON, nullable=False, server_default='{}')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
