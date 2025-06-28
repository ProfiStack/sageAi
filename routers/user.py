from fastapi import APIRouter, HTTPException
from services.ai import user_sessions, manager

router = APIRouter()

@router.get("/user/{user_id}/history")
async def get_chat_history(user_id: str, limit: int = 20):
    if user_id not in user_sessions:
        raise HTTPException(status_code=404, detail="User not found")

    chat_history = user_sessions[user_id].get('chat_history', [])
    return {
        "user_id": user_id,
        "history": chat_history[-limit:],
        "total_messages": len(chat_history)
    }

@router.delete("/user/{user_id}/history")
async def clear_chat_history(user_id: str):
    if user_id not in user_sessions:
        raise HTTPException(status_code=404, detail="User not found")

    user_sessions[user_id]['chat_history'] = []
    return {"message": "Chat history cleared", "user_id": user_id}

@router.get("/users")
async def get_all_users():
    users = []
    for user_id, data in user_sessions.items():
        users.append({
            "user_id": user_id,
            "skin_type": data.get('skin_type'),
            "concern": data.get('concern'),
            "created_at": data.get('created_at'),
            "last_active": data.get('last_active'),
            "message_count": len(data.get('chat_history', [])),
            "is_connected": user_id in manager.active_connections
        })

    return {
        "total_users": len(users),
        "active_connections": len(manager.active_connections),
        "users": users
    }