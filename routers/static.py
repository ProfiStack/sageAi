from fastapi import APIRouter
from models.db_models import StaticMessages
from db import SessionLocal

router = APIRouter()

@router.get("/static_messages")
async def static_messages():
    try:
        db = SessionLocal()
        static_messages = db.query(StaticMessages).first()

        return static_messages
    finally:
        db.close()
