from fastapi import APIRouter, WebSocket, WebSocketDisconnect

import os
import json
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
from db import SessionLocal
import asyncio
from services.db_service import save_chat_message, get_user_session_data
from concurrent.futures import ThreadPoolExecutor
from prompts.ingredients import get_ingredient_checker_prompt
from prompts.skin_care import get_skincare_prompt
from prompts.tend_analysis import get_trend_analysis_prompt
from prompts.treatment import get_treatment_plan_prompt
executor = ThreadPoolExecutor()


load_dotenv()
chat_gpt = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


import json


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, dict[str, WebSocket]] = {}

    async def connect(self, user_id: str, feature_type: str, websocket: WebSocket):
        """Store connections by user_id and feature_type"""
        if user_id not in self.active_connections:
            self.active_connections[user_id] = {}
        self.active_connections[user_id][feature_type] = websocket

    def disconnect(self, user_id: str, feature_type: str):
        """Remove specific feature connection for user"""
        if user_id in self.active_connections:
            self.active_connections[user_id].pop(feature_type, None)
            # Clean up if no more connections for this user
            if not self.active_connections[user_id]:
                self.active_connections.pop(user_id)

    async def send_message(self, message: dict, user_id: str, feature_type: str):
        """Send message to specific feature connection"""
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id].get(feature_type)
            if websocket:
                try:
                    await websocket.send_text(json.dumps(message))
                    return True
                except Exception as e:
                    print(
                        f"[send_message] Error sending to {user_id}/{feature_type}: {e}"
                    )
                    self.disconnect(user_id, feature_type)
        return False


manager = ConnectionManager()

# Main function to get the appropriate prompt based on feature
def get_feature_prompt(feature_type: str, user_metrics: dict):
    try:
        if feature_type == "trend_analysis":
            return get_trend_analysis_prompt(user_metrics)
        elif feature_type == "ingredient_checker":
            return get_ingredient_checker_prompt(user_metrics)
        elif feature_type == "treatment_planning":
            return get_treatment_plan_prompt(user_metrics)
        else:
            return get_skincare_prompt(user_metrics)
    except Exception as e:
        print(f"[get_feature_prompt] Error: {e}")
        return get_skincare_prompt({})



async def get_ai_response(feature_type: str, message: str, user_id: str):
    try:
        db = SessionLocal()
        try:
            user_data = get_user_session_data(db, user_id, feature_type)
        finally:
            db.close()

        system_prompt = get_feature_prompt(feature_type, user_data)
        messages = [{"role": "system", "content": system_prompt}]
        chat_history = user_data.get("chat_history", [])[-10:]
        messages.extend(chat_history)
        messages.append({"role": "user", "content": message})
        if "end chat" in message.lower():
            return "Thank you for chatting with us :)"

        try:
            # Assuming synchronous SDK call; consider async if available
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
            print(f"[OpenAI] API call failed: {e}")
            return "Sorry! I had trouble generating a response. Please try again in a moment."

        db_message = messages.copy()
        db_message.append({"role": "system", "content": ai_response})
        save_chat_message(db, user_id, feature_type, message, db_message)
        db.close()
        return ai_response
    except Exception as outer_err:
        print(f"[get_ai_response] Fatal error: {outer_err}")
        return "Oops! Something went wrong. Please try again later."
