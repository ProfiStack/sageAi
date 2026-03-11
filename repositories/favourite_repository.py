import json
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import text

from models.db_models import UserFavourite


def get_favourites(db: Session, user_id: str):
    return db.query(UserFavourite).filter(UserFavourite.user_id == user_id).all()


def find_existing_favourite(db: Session, user_id: str, fav_json_str: str):
    return (
        db.query(UserFavourite)
        .filter(UserFavourite.user_id == user_id)
        .filter(text("user_favourites::jsonb = (:fav_json)::jsonb"))
        .params(fav_json=fav_json_str)
        .first()
    )


def create_favourite(db: Session, user_id: str, user_favourites: dict) -> UserFavourite:
    entry = UserFavourite(
        id=str(uuid.uuid4()),
        user_id=user_id,
        user_favourites=user_favourites,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(entry)
    db.commit()
    return entry


def delete_favourite(db: Session, entry: UserFavourite):
    db.delete(entry)
    db.commit()
