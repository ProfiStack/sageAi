from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime


class ReviewCreate(BaseModel):
    reviewer_name: str = Field(..., min_length=2, max_length=100)
    reviewer_country: str = Field(..., min_length=2, max_length=100)
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = Field(None, max_length=200)
    body: str = Field(..., min_length=10)
    feature_tag: Optional[str] = Field(None, max_length=50)

    @field_validator("feature_tag")
    @classmethod
    def validate_feature_tag(cls, v):
        allowed = {None, "skin_analysis", "shade_matching", "general", "recommendation", "onboarding"}
        if v not in allowed:
            raise ValueError(f"feature_tag must be one of: {', '.join(str(t) for t in allowed if t)}")
        return v


class ReviewUpdate(BaseModel):
    reviewer_name: Optional[str] = Field(None, min_length=2, max_length=100)
    reviewer_country: Optional[str] = Field(None, min_length=2, max_length=100)
    rating: Optional[int] = Field(None, ge=1, le=5)
    title: Optional[str] = Field(None, max_length=200)
    body: Optional[str] = Field(None, min_length=10)
    feature_tag: Optional[str] = Field(None, max_length=50)
    is_published: Optional[bool] = None


class ReviewResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    reviewer_name: str
    reviewer_country: str
    rating: int
    title: Optional[str] = None
    body: str
    feature_tag: Optional[str] = None
    is_published: bool
    is_seeded: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ReviewListResponse(BaseModel):
    total: int
    reviews: list[ReviewResponse]
    average_rating: float
