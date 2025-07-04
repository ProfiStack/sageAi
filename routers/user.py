from fastapi import APIRouter, HTTPException, Depends
from services.ai import manager
from sqlalchemy.orm import Session
from models.db_models import ChatResults, ChatMessage  # Your SQLAlchemy models
from db import SessionLocal
from services.db_service import get_user_session_data, update_user_session_metrics, get_user_chat_data
from concurrent.futures import ThreadPoolExecutor
import uuid
from datetime import datetime
import asyncio
from openai import OpenAI
from dotenv import load_dotenv
import os

router = APIRouter()
load_dotenv()
chat_gpt = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


system_prompt = (
    "You are Sagee, a skincare ingredients expert who generates beautiful, detailed HTML summaries from user conversations.\n\n"
    "Your task:\n"
    "Given the full conversation history with a user, generate a visually clear HTML output summarizing:\n\n"
    "1. Chat interaction summary (what user asked, confusion if present)\n"
    "2. Clarified intent (if possible — even if user typed random inputs)\n"
    "3. Product recommendations (broad categories like \"serum with niacinamide\")\n"
    "4. Ingredient recommendations or alerts (e.g. **warn about allergens**)\n\n"
    "Output Format:\n"
    "- Use <div>, <h2>, <p>, <ul>, <li>, <strong>, <em> etc. for clear structure\n"
    "- Use 1 emoji maximum to keep tone friendly\n"
    "- Add subtle inline styles like padding, font-family, color for readability\n"
    "- Avoid hardcoding specific products unless the user names them\n"
    "- Mention if the chat was confusing, and how Sagee tried to guide the user"
)

router = APIRouter()
executor = ThreadPoolExecutor()

@router.get("/user/{user_id}/history")
def get_chat_history_by_type(user_id: str, limit: int = 20):
    db = SessionLocal()
    history = db.query(ChatMessage)\
                .filter_by(user_id=user_id)\
                .order_by(ChatMessage.timestamp.desc())\
                .limit(limit)\
                .all()
    
    return {
        "user_id": user_id,
        "history": [
            {
                "message": chat.message,
                "id": chat.id,
                "response": chat.response,
                "timestamp": chat.timestamp,
                "type": chat.type
            } for chat in history
        ]
    }

@router.get("/user/{user_id}/chat/{chat_id}")
async def get_or_create_chat_results(user_id: str, chat_id: str):
    db = SessionLocal()
    print(user_id, chat_id);
    chat_data = get_user_chat_data(db, user_id, chat_id)
    
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
        user_id=user_id,
        chat_id=chat_id,
        results=ai_response,
        timestamp=datetime.utcnow(),
    )
    db.add(new_result)
    db.commit()

    return {"results": ai_response.replace("\n", "").replace("\r", "")}

@router.get("/user/{user_id}/history/{feature_type}")
async def get_chat_history(user_id: str, feature_type: str, limit: int = 20):
    try:
        print(f"[get_chat_history] Feature type: {feature_type}")
        db = SessionLocal()
        user_data = get_user_session_data(db, user_id, feature_type)

        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")

        chat_history = user_data.get("chat_history", [])
        db.close()
        return {
            "user_id": user_id,
            "history": chat_history[-limit:],
            "total_messages": len(chat_history),
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
        db.close()
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
            chat_history = user_data.get("chat_history", []) if user_data else []
            users.append(
                {
                    "user_id": profile.user_id,
                    "skin_type": profile.skin_type,
                    "concern": profile.concern,
                    "created_at": profile.created_at,
                    "last_active": profile.last_active,
                    "message_count": len(chat_history),
                    "is_connected": profile.user_id in manager.active_connections,
                }
            )
        db.close()
        return {
            "total_users": len(users),
            "active_connections": len(manager.active_connections),
            "users": users,
        }

    except Exception as e:
        print(f"[get_all_users] Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch users")
