from fastapi import APIRouter
from datetime import datetime
from services.ai import ollama, manager, user_sessions

router = APIRouter()

@router.get("/health")
async def health_check():
    try:
        test_response = ollama.chat.completions.create(
            model="llama3.2:1b",
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=10
        )
        ollama_status = "connected"
        ollama_model = "llama3.2:1b"
    except Exception as e:
        ollama_status = f"disconnected: {str(e)}"
        ollama_model = "unknown"

    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "ollama": {
            "status": ollama_status,
            "model": ollama_model
        },
        "stats": {
            "active_connections": len(manager.active_connections),
            "total_users": len(user_sessions),
            "active_users": manager.get_active_users()
        }
    }
