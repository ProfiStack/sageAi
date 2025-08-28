from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from prompts.image_analysis import clean_html_code, get_image_analysis_prompt
from prompts.shade_matching import get_shade_matching_prompt
from routers.auth import get_current_user
from services.ai import analyze_skin_features
from sqlalchemy.orm import Session
from models.db_models import  ChatMessage, ChatResults, HairMessage, StylingMessage,  HairMessage, IngredientMessage, NutritionMessage, WellnessMessage, TrendMessage, TreatmentMessage
from db import SessionLocal
from services.db_service import (
    get_user_chat_data,
)

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from io import BytesIO
from PIL import Image
import base64
from prompts.result import result_prompt
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

system_prompt = result_prompt
router = APIRouter()
executor = ThreadPoolExecutor()
MODEL_MAP = {
    "skincare": ChatMessage,
    "hair_care": HairMessage,
    "ingredient_checker": IngredientMessage,
    "nutrition": NutritionMessage,
    "wellness": WellnessMessage,
    "trend_analysis": TrendMessage,
    "treatment_planning": TreatmentMessage,
    "styling": StylingMessage,  # If styling uses same table as skincare
}

@router.get("/user/chat/{chat_id}")
async def get_or_create_chat_results(user_db: user_dependency, chat_id: str):
    db = SessionLocal()
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
    db.close()
    return {"results": ai_response.replace("\n", "").replace("\r", "")}


@router.get("/user/history/{type}")
def get_chat_history_by_type(user_db: user_dependency, type: str, limit: int = 20):
    ModelClass = MODEL_MAP.get(type, ChatMessage)
    db = SessionLocal()
    history = (
        db.query(ModelClass)
        .filter_by(user_id=user_db.get("user_id"), type=type)
        .order_by(ModelClass.timestamp.desc())
        .limit(limit)
        .all()
    )
    db.close()
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


@router.get("/user/history")
def get_chat_history_by_type(user_db: user_dependency, limit: int = 20):
    db = SessionLocal()
    history = (
        db.query(ChatMessage)
        .filter_by(user_id=user_db.get("user_id"))
        .order_by(ChatMessage.timestamp.desc())
        .limit(limit)
        .all()
    )
    db.close()
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

@router.post("/user/analyze/skin-photo")
async def analyze_skin_photo(
    image: UploadFile = File(..., description="The image to analyze"),
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image type")

    image_bytes = await image.read()

    try:
        result = await analyze_skin_features(image_bytes)
        message = get_image_analysis_prompt(result)
        print(message);
        messages = [{"role": "system", "content": message}]
        response = await asyncio.get_event_loop().run_in_executor(
            executor,
            lambda: chat_gpt.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7,
            ),
        )
        html_result = response.choices[0].message.content
        html_result = clean_html_code(html_result);
        return {"results": html_result}

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})

@router.post("/user/analyze/shade-matching")
async def analyze_skin_photo(
    image: UploadFile = File(..., description="The image to analyze"),
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image type")

    image_bytes = await image.read()

    try:
        result = await analyze_skin_features(image_bytes)
        message = get_shade_matching_prompt(result)
        print(message);
        messages = [{"role": "system", "content": message}]
        response = await asyncio.get_event_loop().run_in_executor(
            executor,
            lambda: chat_gpt.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7,
            ),
        )
        html_result = response.choices[0].message.content
        html_result = clean_html_code(html_result);
        return {"results": html_result}

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})
