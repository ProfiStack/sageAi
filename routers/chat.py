# routers/chat.py
from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from models.schemas import ChatRequest, ChatResponse
from routers.auth import get_current_user
from services.ai import get_ai_response
from services.db_service import get_or_create_user_profile, save_chat_message
from db import SessionLocal
import uuid

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

user_dependency = Annotated[Session, Depends(get_current_user)]

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_message: ChatRequest, user_db: user_dependency, db: Session = Depends(get_db)):
    user_id = user_db.get('user_id')
    try:
        get_or_create_user_profile(db, user_id)
        ai_response = await get_ai_response(chat_message.message, user_id)
        save_chat_message(db, user_id, chat_message.message, ai_response)

        return ChatResponse(
            response=ai_response,
            user_id=user_id,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")
