import asyncio
import uuid
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from fastapi import HTTPException
from sqlalchemy.orm import Session

from core.database import SessionLocal
from models.db_models import ChatResults
from repositories.user_repository import get_or_create_user_profile
from repositories.chat_repository import get_user_chat_data
from services.ai_chat import get_ai_response, chat_gpt
from schemas.chat import ChatRequest, ChatResponse
from prompts.result import result_prompt

executor = ThreadPoolExecutor()
system_prompt = result_prompt


async def chat(chat_message: ChatRequest, user_db: dict, db: Session) -> ChatResponse:
    user_id = user_db.get("user_id")
    try:
        get_or_create_user_profile(db, user_id)
        ai_response = await get_ai_response("skincare", chat_message.message, user_id)
        return ChatResponse(
            response=ai_response,
            user_id=user_id,
            timestamp=datetime.now().isoformat(),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")


async def get_or_create_chat_results(user_db: dict, chat_id: str) -> dict:
    db = SessionLocal()
    try:
        chat_data = get_user_chat_data(db, user_db.get("user_id"), chat_id)

        if "results" in chat_data:
            return {"results": chat_data["results"]}

        chat_history = chat_data["chat_history"]
        if not chat_history:
            raise HTTPException(status_code=404, detail="No chat messages found.")

        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(chat_history)

        try:
            response = await asyncio.get_event_loop().run_in_executor(
                executor,
                lambda: chat_gpt.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    temperature=0.7,
                ),
            )
            ai_response = response.choices[0].message.content
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

        new_result = ChatResults(
            id=str(uuid.uuid4()),
            user_id=user_db.get("user_id"),
            chat_id=chat_id,
            results=ai_response,
            timestamp=datetime.utcnow(),
        )
        db.add(new_result)
        db.commit()
        return {"results": ai_response.replace("\n", "").replace("\r", "")}
    finally:
        db.close()
