# routers/profile.py
from datetime import datetime, timezone
import json
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.db_models import UserFavourite
from models.schemas import UserFavouriteRequest
from routers.auth import get_current_user
from db import SessionLocal
import uuid
from sqlalchemy import text


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


user_dependency = Annotated[Session, Depends(get_current_user)]


# --- Pydantic schema for incoming data ---


# @router.post("/favourites/{user_id}")
# def create_or_update_favourite(data: UserFavouriteRequest, user_db: user_dependency, db: Session = Depends(get_db), user_id: str = None):
#     try:
#         new_entry = UserFavourite(
#             id=str(uuid.uuid4()),
#             user_id=user_id,
#             user_favourites=data.user_favourites,
#             created_at=datetime.utcnow(),
#             updated_at=datetime.utcnow(),
#         )
#         db.add(new_entry)
#         db.commit()
#         return {"message": "Favourites saved successfully"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


@router.post("/favourites/{user_id}")
def create_or_update_favourite(data: UserFavouriteRequest, user_db: user_dependency, db: Session = Depends(get_db), user_id: str = None):
    try:
        # Check if favourite exists for this user
      # Convert JSON to string for safe comparison
      fav_json_str = json.dumps(data.user_favourites, separators=(",", ":"), sort_keys=True)
      print(fav_json_str)
      # Try to find an existing record for the same user and same favourite
        # Compare as jsonb: cast both column and param to jsonb
      existing_fav = (
          db.query(UserFavourite)
          .filter(user_db.get('user_id') == user_id)
          .filter(text("user_favourites::jsonb = (:fav_json)::jsonb"))
          .params(fav_json=fav_json_str)
          .first()
      )

      if existing_fav:
          # If exists → delete it
          db.delete(existing_fav)
          db.commit()
          return {"message": "Existing favourite removed successfully"}
      else:
          # If not exists → create new
          new_entry = UserFavourite(
              id=str(uuid.uuid4()),
              user_id=user_id,
              user_favourites=data.user_favourites,
              created_at=datetime.utcnow(),
              updated_at=datetime.utcnow(),
          )
          db.add(new_entry)
          db.commit()
          return {"message": "New favourite added successfully"}
    except Exception as e:
      db.rollback()
      raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# --- GET route to fetch favourites by user_id ---
@router.get("/favourites/{user_id}")
def get_favourite(user_db: user_dependency, db: Session = Depends(get_db), user_id: str = None):
    fav = db.query(UserFavourite).filter(UserFavourite.user_id == user_db.get("user_id")).all()
    if not fav:
        raise HTTPException(status_code=404, detail="User favourites not found")
    print(fav)
    return fav;
