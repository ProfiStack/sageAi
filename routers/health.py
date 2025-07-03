from fastapi import APIRouter
from datetime import datetime
from services.ai import manager
from db import SessionLocal
from services.db_service import get_all_user_profiles

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
                "active_users": manager.get_active_users()
            }
        }

    except Exception as e:
        return {
            "status": "error",
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }
