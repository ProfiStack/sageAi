import datetime
from fastapi import Header, HTTPException, Depends
from sqlalchemy.orm import Session
import hashlib

from core.database import SessionLocal
from models.b2b_models import B2BApiKey


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_b2b_bearer(authorization: str = Header(...), db: Session = Depends(get_db)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    raw_key = authorization.replace("Bearer ", "")
    hashed_key = hashlib.sha256(raw_key.encode()).hexdigest()

    api_key = (
        db.query(B2BApiKey)
        .filter(B2BApiKey.api_key_hash == hashed_key, B2BApiKey.is_active == True)
        .first()
    )

    if not api_key:
        raise HTTPException(status_code=403, detail="Invalid API key")

    api_key.last_used_at = datetime.datetime.utcnow()
    db.commit()

    return api_key.client_id
