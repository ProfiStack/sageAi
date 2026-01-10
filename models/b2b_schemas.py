# models/b2b_schemas.py
from pydantic import BaseModel
from typing import List, Optional


class CreateB2BUserRequest(BaseModel):
    client_id: str
    external_user_id: str
    consent: bool
    source: str

class ScanAttribute(BaseModel):
    value: str
    confidence: float


class ScanInput(BaseModel):
    skin_type: ScanAttribute | None = None
    concerns: List[ScanAttribute]
    hydration: ScanAttribute | None = None


class RecommendedProduct(BaseModel):
    id: str
    brand_name: str
    product_name: str
    url: str
    score: float
    reasons: List[str]


class RecommendationResponse(BaseModel):
    products: List[RecommendedProduct]
