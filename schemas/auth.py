from pydantic import BaseModel, EmailStr
from typing import Optional


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
