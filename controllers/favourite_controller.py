import json
from fastapi import HTTPException
from sqlalchemy.orm import Session

from repositories.favourite_repository import (
    find_existing_favourite,
    create_favourite,
    delete_favourite,
    get_favourites,
)
from schemas.favourite import UserFavouriteRequest


def create_or_update_favourite(data: UserFavouriteRequest, user_db: dict, db: Session) -> dict:
    try:
        user_id = user_db.get("user_id")
        fav_json_str = json.dumps(data.user_favourites, separators=(",", ":"), sort_keys=True)

        existing_fav = find_existing_favourite(db, user_id, fav_json_str)
        if existing_fav:
            delete_favourite(db, existing_fav)
            return {"message": "Existing favourite removed successfully"}
        else:
            create_favourite(db, user_id, data.user_favourites)
            return {"message": "New favourite added successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


def get_favourite(user_db: dict, db: Session) -> list:
    fav = get_favourites(db, user_db.get("user_id"))
    if not fav:
        raise HTTPException(status_code=404, detail="User favourites not found")
    return fav
