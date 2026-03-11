from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserFavouriteRequest(BaseModel):
    user_favourites: Optional[dict] = None


class UserFavouriteResponse(BaseModel):
    user_favourites: dict
    created_at: datetime
    updated_at: datetime
