# models/schemas.py
from pydantic import BaseModel,EmailStr
from typing import Optional
from datetime import datetime

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    user_id: str
    timestamp: str

class UserProfileRequest(BaseModel):
    skin_type: Optional[str] = None
    lifestyle: Optional[str] = None
    concern: Optional[str] = None
    preferred_routine: Optional[str] = None

class UserProfileResponse(UserProfileRequest):
    name: Optional[str] = None
    age: Optional[str] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    user_id: str
    created_at: datetime
    last_active: datetime
    skin_type: Optional[str] = None
    lifestyle: Optional[str] = None
    concern: Optional[str] = None
    preferred_routine: Optional[str] = None


class LoginRequest(BaseModel):
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None

class LoginResponse(BaseModel):
    user_id: str
    message: str

class UserProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    age: Optional[str] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    skin_type: Optional[str] = None
    concern: Optional[str] = None
    lifestyle: Optional[str] = None
    preferred_routine: Optional[str] = None
