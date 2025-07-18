from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends
from routers.auth import get_current_user
from services.ai import manager
from sqlalchemy.orm import Session
from models.db_models import ChatResults, ChatMessage  # Your SQLAlchemy models
from db import SessionLocal
from services.db_service import (
    get_user_chat_data,
)
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

user_dependency = Annotated[Session, Depends(get_current_user)]

system_prompt = (
    """You are Sagee, a skincare expert who generates beautiful, detailed HTML summaries from user conversations.

**Your Task:**
Create a comprehensive HTML summary of the skincare consultation with perfect visual hierarchy and clear information architecture. Follow these guidelines:

1. **Structure Requirements:**
<div style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; max-width: 800px; margin: 0 auto; line-height: 1.6;">
  <section style="margin-bottom: 30px;">
    <h2 style="color: #2C3E50; border-bottom: 2px solid #E8E8E8; padding-bottom: 8px;">Chat Interaction Summary</h2>
    <!-- Content -->
  </section>
  
  <section style="margin-bottom: 30px;">
    <h2 style="color: #2C3E50; border-bottom: 2px solid #E8E8E8; padding-bottom: 8px;">Analysis & Recommendations</h2>
    <!-- Content -->
  </section>
  
  <section style="margin-bottom: 30px;">
    <h2 style="color: #2C3E50; border-bottom: 2px solid #E8E8E8; padding-bottom: 8px;">Ingredient Breakdown</h2>
    <!-- Content -->
  </section>
</div>

2. **Content Rules:**
- Always include these 3 main sections with the exact headings above
- Use <h3> for subsections when needed
- Present ingredients in tables when comparing multiple components
- Highlight warnings with <span style="color: #E74C3C; font-weight: 600;">
- Use proper HTML semantic elements (<section>, <article>)
- Include subtle hover effects for interactive feel

3. **Style Requirements:**
- Primary color: #2C3E50
- Secondary color: #3498DB
- Warning color: #E74C3C
- Font stack: 'Segoe UI', Roboto, Arial
- Responsive padding/margins
- Subtle box-shadows for depth

4. **Tone Guidelines:**
- Professional yet approachable
- Maximum 1 emoji per section
- Actionable advice
- Clear visual hierarchy

5. **Special Cases:**
- For confusing chats: Include a "Conversation Flow" subsection showing how you guided the user
- For price requests: Add a "Value Assessment" subsection comparing ingredient quality
- For allergic reactions: Create a prominent "Safety First" warning box

Example of excellent output:
<div style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; max-width: 800px; margin: 0 auto; line-height: 1.6;">
  <section style="margin-bottom: 30px;">
    <h2 style="color: #2C3E50; border-bottom: 2px solid #E8E8E8; padding-bottom: 8px;">Chat Interaction Summary</h2>
    <p>The consultation focused on <strong>anti-aging solutions</strong> with specific interest in <em>Clarins Double Serum</em>.</p>
  </section>
  
  <section style="margin-bottom: 30px;">
    <h2 style="color: #2C3E50; border-bottom: 2px solid #E8E8E8; padding-bottom: 8px;">Analysis & Recommendations</h2>
    <article style="background: #F8F9FA; padding: 15px; border-radius: 5px; margin-top: 15px;">
      <h3 style="color: #3498DB;">Best Suited For</h3>
      <ul>
        <li>Users seeking multi-active formulas</li>
        <li>Those prioritizing hydration + anti-aging</li>
      </ul>
    </article>
  </section>
  
  <section style="margin-bottom: 30px;">
    <h2 style="color: #2C3E50; border-bottom: 2px solid #E8E8E8; padding-bottom: 8px;">Ingredient Breakdown</h2>
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
          <tr style="background-color: #2C3E50; color: white;">
            <th style="padding: 10px; text-align: left;">Ingredient</th>
            <th style="padding: 10px; text-align: left;">Benefit</th>
            <th style="padding: 10px; text-align: left;">Consideration</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;"><strong>Turmeric Extract</strong></td>
            <td style="padding: 10px;">Antioxidant protection</td>
            <td style="padding: 10px;">Potential irritation</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</div>

Now generate the most beautifully structured HTML summary for the current conversation, following all these guidelines precisely."""
)

router = APIRouter()
executor = ThreadPoolExecutor()

@router.get("/user/chat/{chat_id}")
async def get_or_create_chat_results(user_db: user_dependency, chat_id: str):
    db = SessionLocal()
    chat_data = get_user_chat_data(db, user_db.get('user_id'), chat_id)

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
        user_id=user_db.get('user_id'),
        chat_id=chat_id,
        results=ai_response,
        timestamp=datetime.utcnow(),
    )
    db.add(new_result)
    db.commit()
    db.close()
    return {"results": ai_response.replace("\n", "").replace("\r", "")}


@router.get("/user/history/{type}")
def get_chat_history_by_type(
    user_db: user_dependency , type: str, limit: int = 20
):
    db = SessionLocal()
    history = (
        db.query(ChatMessage)
        .filter_by(user_id=user_db.get('user_id'), type=type)
        .order_by(ChatMessage.timestamp.desc())
        .limit(limit)
        .all()
    )
    db.close()
    return {
        "user_id": user_db.get('user_id'),
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


@router.get("/user/history")
def get_chat_history_by_type(user_db: user_dependency, user_id: str, limit: int = 20):
    db = SessionLocal()
    history = (
        db.query(ChatMessage)
        .filter_by(user_id=user_db.get('user_id'))
        .order_by(ChatMessage.timestamp.desc())
        .limit(limit)
        .all()
    )
    db.close()
    return {
        "user_id": user_db.get('user_id'),
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




# @router.delete("/user/{user_id}/history")
# async def clear_chat_history(user_id: str):
#     try:
#         db = SessionLocal()
#         user_data = get_user_session_data(db, user_id)

#         if not user_data:
#             raise HTTPException(status_code=404, detail="User not found")

#         # Reset history in DB
#         update_user_session_metrics(db, user_id, chat_history=[])
#         db.close()
#         return {"message": "Chat history cleared", "user_id": user_id}

#     except Exception as e:
#         print(f"[clear_chat_history] Error: {e}")
#         raise HTTPException(status_code=500, detail="Failed to clear chat history")


# @router.get("/users")
# async def get_all_users(user_db: user_dependency):
#     try:
#         db = SessionLocal()
#         users = []
#         from services.db_service import get_all_user_profiles

#         all_profiles = get_all_user_profiles(db)

#         for profile in all_profiles:
#             users.append(
#                 {
#                     "user_id": profile.user_id,
#                     "skin_type": profile.skin_type,
#                     "concern": profile.concern,
#                     "created_at": profile.created_at,
#                     "last_active": profile.last_active,
#                     "is_connected": profile.user_id in manager.active_connections,
#                 }
#             )
#         db.close()
#         return {
#             "total_users": len(users),
#             "active_connections": len(manager.active_connections),
#             "users": users,
#         }

#     except Exception as e:
#         print(f"[get_all_users] Error: {e}")
#         raise HTTPException(status_code=500, detail="Failed to fetch users")
