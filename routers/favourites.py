# routers/profile.py
from datetime import datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.db_models import UserFavourite
from models.schemas import UserFavouriteRequest
from routers.auth import get_current_user
from db import SessionLocal
import uuid


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


user_dependency = Annotated[Session, Depends(get_current_user)]


# --- Pydantic schema for incoming data ---

# --- POST route to create/update favourites ---
@router.post("/favourites/{user_id}")
def create_or_update_favourite(data: UserFavouriteRequest, user_db: user_dependency, db: Session = Depends(get_db), user_id: str = None):
    try:
        new_entry = UserFavourite(
            id=str(uuid.uuid4()),
            user_id=user_id,
            user_favourites=data.user_favourites,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(new_entry)
        db.commit()
        return {"message": "Favourites saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- GET route to fetch favourites by user_id ---
@router.get("/favourites/{user_id}")
def get_favourite(user_db: user_dependency, db: Session = Depends(get_db), user_id: str = None):
    fav = db.query(UserFavourite).filter(user_id == user_db.get("user_id")).all()
    if not fav:
        raise HTTPException(status_code=404, detail="User favourites not found")
    print(fav)
    return fav;
