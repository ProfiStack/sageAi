import uuid
from datetime import datetime
from sqlalchemy import (
    Boolean,
    Column,
    Float,
    ForeignKey,
    String,
    JSON,
    DateTime,
)
from core.database import Base


class B2BClient(Base):
    __tablename__ = "b2b_clients"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    email = Column(String, unique=True, nullable=False)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)


class B2BApiKey(Base):
    __tablename__ = "b2b_api_keys"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, ForeignKey("b2b_clients.id"), index=True, nullable=False)
    label = Column(String, nullable=True)
    api_key_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used_at = Column(DateTime)


class B2BUser(Base):
    __tablename__ = "b2b_users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=True)
    client_id = Column(String, ForeignKey("b2b_clients.id"), index=True, nullable=False)
    external_user_id = Column(String)
    consent = Column(Boolean, default=True)
    source = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class B2BFaceScan(Base):
    __tablename__ = "b2b_face_scans"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    b2b_user_id = Column(String, ForeignKey("b2b_users.id"), index=True, nullable=False)
    skin_type = Column(String)
    skin_type_confidence = Column(Float)
    concerns = Column(JSON)
    concerns_confidence = Column(JSON)
    tone = Column(String)
    tone_confidence = Column(Float)
    undertone = Column(String)
    undertone_confidence = Column(Float)
    texture = Column(String)
    texture_confidence = Column(Float)
    under_eye = Column(String)
    under_eye_confidence = Column(Float)
    lip_color = Column(String)
    lip_color_confidence = Column(Float)
    age_range = Column(String)
    gender = Column(String)
    lifestyle = Column(String)
    scan_version = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    brand_name = Column(String, nullable=False)
    product_name = Column(String)
    url = Column(String, unique=True, nullable=False)
    price_cents = Column(Float)
    currency = Column(String, default="AED")
    size = Column(String)
    description = Column(String)
    ingredients = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class SkinAttribute(Base):
    __tablename__ = "skin_attributes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    key = Column(String, unique=True, nullable=False)


class ProductSkinBenefit(Base):
    __tablename__ = "product_skin_benefits"

    product_id = Column(String, ForeignKey("products.id", ondelete="CASCADE"), primary_key=True)
    attribute_id = Column(ForeignKey("skin_attributes.id"), primary_key=True)
    weight = Column(Float, default=1.0)
