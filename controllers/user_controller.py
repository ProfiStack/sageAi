from core.database import SessionLocal
from repositories.chat_repository import MODEL_MAP
from models.db_models import ChatMessage


def get_chat_history_by_type(user_db: dict, type: str, limit: int = 20) -> dict:
    ModelClass = MODEL_MAP.get(type, ChatMessage)
    db = SessionLocal()
    try:
        history = (
            db.query(ModelClass)
            .filter_by(user_id=user_db.get("user_id"), type=type)
            .order_by(ModelClass.timestamp.desc())
            .limit(limit)
            .all()
        )
        return {
            "user_id": user_db.get("user_id"),
            "type": type,
            "history": [
                {
                    "message": chat.message,
                    "response": chat.response,
                    "timestamp": chat.timestamp,
                }
                for chat in history
            ],
        }
    finally:
        db.close()


def get_chat_history(user_db: dict, limit: int = 20) -> dict:
    db = SessionLocal()
    try:
        history = (
            db.query(ChatMessage)
            .filter_by(user_id=user_db.get("user_id"))
            .order_by(ChatMessage.timestamp.desc())
            .limit(limit)
            .all()
        )
        return {
            "user_id": user_db.get("user_id"),
            "history": [
                {
                    "message": chat.message,
                    "id": chat.id,
                    "response": chat.response,
                    "timestamp": chat.timestamp,
                    "type": chat.type,
                }
                for chat in history
            ],
        }
    finally:
        db.close()
