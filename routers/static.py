from fastapi import APIRouter

from core.database import SessionLocal
from models.db_models import StaticMessages

router = APIRouter()


@router.get("/static_messages")
async def static_messages():
    try:
        db = SessionLocal()
        return db.query(StaticMessages).first()
    finally:
        db.close()
