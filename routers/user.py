from fastapi import APIRouter, HTTPException
from services.ai import manager
from db import SessionLocal
from services.db_service import get_user_session_data, update_user_session_metrics

router = APIRouter()

@router.get("/user/{user_id}/history")
async def get_chat_history(user_id: str, limit: int = 20):
    try:
        db = SessionLocal()
        user_data = get_user_session_data(db, user_id)

        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")

        chat_history = user_data.get('chat_history', [])
        return {
            "user_id": user_id,
            "history": chat_history[-limit:],
            "total_messages": len(chat_history)
        }

    except Exception as e:
        print(f"[get_chat_history] Error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/user/{user_id}/history")
async def clear_chat_history(user_id: str):
    try:
        db = SessionLocal()
        user_data = get_user_session_data(db, user_id)

        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")

        # Reset history in DB
        update_user_session_metrics(db, user_id, chat_history=[])
        return {"message": "Chat history cleared", "user_id": user_id}

    except Exception as e:
        print(f"[clear_chat_history] Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to clear chat history")

@router.get("/users")
async def get_all_users():
    try:
        db = SessionLocal()
        users = []

        # Simulate listing users from DB if you have a profile table
        # This part assumes `get_all_user_profiles` exists (can help you write it if needed)
        from services.db_service import get_all_user_profiles
        all_profiles = get_all_user_profiles(db)

        for profile in all_profiles:
            user_data = get_user_session_data(db, profile.user_id)
            chat_history = user_data.get('chat_history', []) if user_data else []
            users.append({
                "user_id": profile.user_id,
                "skin_type": profile.skin_type,
                "concern": profile.concern,
                "created_at": profile.created_at,
                "last_active": profile.last_active,
                "message_count": len(chat_history),
                "is_connected": profile.user_id in manager.active_connections
            })

        return {
            "total_users": len(users),
            "active_connections": len(manager.active_connections),
            "users": users
        }

    except Exception as e:
        print(f"[get_all_users] Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch users")
