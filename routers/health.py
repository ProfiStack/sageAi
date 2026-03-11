from fastapi import APIRouter
from datetime import datetime

from core.database import SessionLocal
from repositories.user_repository import get_all_user_profiles
from services.websocket import manager

router = APIRouter()


@router.get("/health")
async def health_check():
    try:
        db = SessionLocal()
        user_profiles = get_all_user_profiles(db)
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "stats": {
                "active_connections": len(manager.active_connections),
                "total_users": len(user_profiles),
            },
        }
    finally:
        db.close()
