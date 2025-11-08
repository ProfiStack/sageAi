# models/schemas.py
from pydantic import BaseModel,EmailStr
from typing import List, Optional
from datetime import datetime

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    user_id: str
    timestamp: str

class ChatResultResponse(BaseModel):
    response: str
    timestamp: str

class SubscriptionRequest(BaseModel):
    price_id: str
    type: str


class UserProfileRequest(BaseModel):
    name: Optional[str] = None
    age: Optional[str] = None
    gender: Optional[str] = None
    skin_type: Optional[str] = None
    lifestyle: Optional[str] = None
    concern: Optional[str] = None
    makeup_goal: Optional[str] = None
    nutrition_goal: Optional[str] = None
    dietary_restriction: Optional[str] = None
    wellness_focus: Optional[str] = None
    dedicate_time: Optional[str] = None
    hair_type: Optional[str] = None
    hair_concern: Optional[str] = None
    style_preference: Optional[str] = None
    styling_goal: Optional[str] = None
    free_scan: Optional[bool] = None
    
class UserProfileResponse(UserProfileRequest):
    name: Optional[str] = None
    age: Optional[str] = None
    gender: Optional[str] = None
    user_id: str
    created_at: datetime
    last_active: datetime
    skin_type: Optional[str] = None
    lifestyle: Optional[str] = None
    concern: Optional[str] = None
    preferred_routine: Optional[str] = None
    makeup_goal: Optional[str] = None
    nutrition_goal: Optional[str] = None
    dietary_restriction: Optional[str] = None
    wellness_focus: Optional[str] = None
    dedicate_time: Optional[str] = None
    hair_type: Optional[str] = None
    hair_concern: Optional[str] = None
    style_preference: Optional[str] = None
    styling_goal: Optional[str] = None
    subscription_status: Optional[str] = None
    free_scan: Optional[bool] = None
    payment_types: List[str]


class AccessTokenResponse(BaseModel):
    access: str
    token: str
    subscription: bool

class LoginRequest(BaseModel):
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    password: str
    name: Optional[str] = None

class LoginResponse(BaseModel):
    user_id: str
    message: str

class UserProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[str] = None
    gender: Optional[str] = None
    skin_type: Optional[str] = None
    concern: Optional[str] = None
    lifestyle: Optional[str] = None
    preferred_routine: Optional[str] = None
    makeup_goal: Optional[str] = None
    nutrition_goal: Optional[str] = None
    dietary_restriction: Optional[str] = None
    wellness_focus: Optional[str] = None
    dedicate_time: Optional[str] = None
    hair_type: Optional[str] = None
    hair_concern: Optional[str] = None
    style_preference: Optional[str] = None
    styling_goal: Optional[str] = None
