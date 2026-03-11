from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user
from schemas.chat import ChatRequest, ChatResponse
from controllers.chat_controller import chat, get_or_create_chat_results

router = APIRouter()
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_message: ChatRequest, user_db: user_dependency, db: Session = Depends(get_db)):
    return await chat(chat_message, user_db, db)


@router.get("/user/chat/{chat_id}")
async def chat_results(user_db: user_dependency, chat_id: str):
    return await get_or_create_chat_results(user_db, chat_id)
