from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user
from schemas.favourite import UserFavouriteRequest
from controllers.favourite_controller import create_or_update_favourite, get_favourite

router = APIRouter()
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.post("/favourites/{user_id}")
def favourites_create_or_update(
    data: UserFavouriteRequest,
    user_db: user_dependency,
    db: Session = Depends(get_db),
    user_id: str = None,
):
    return create_or_update_favourite(data, user_db, db)


@router.get("/favourites/{user_id}")
def favourites_get(user_db: user_dependency, db: Session = Depends(get_db), user_id: str = None):
    return get_favourite(user_db, db)
