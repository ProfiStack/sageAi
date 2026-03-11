from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


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


class UserProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[str] = None
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
