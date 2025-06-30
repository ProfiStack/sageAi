from fastapi import APIRouter
from datetime import datetime
from services.ai import chat_gpt, manager, user_sessions

router = APIRouter()

@router.get("/health")
async def health_check():
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "stats": {
            "active_connections": len(manager.active_connections),
            "total_users": len(user_sessions),
            "active_users": manager.get_active_users()
        }
    }
