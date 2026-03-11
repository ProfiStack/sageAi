import json
from datetime import datetime
from sqlalchemy.orm import Session

from models.db_models import (
    ChatMessage,
    ChatResults,
    HairMessage,
    IngredientMessage,
    NutritionMessage,
    WellnessMessage,
    TrendMessage,
    TreatmentMessage,
    StylingMessage,
)
from repositories.user_repository import get_or_create_user_profile

MODEL_MAP = {
    "skincare": ChatMessage,
    "hair_care": HairMessage,
    "ingredient_checker": IngredientMessage,
    "nutrition": NutritionMessage,
    "wellness": WellnessMessage,
    "trend_analysis": TrendMessage,
    "treatment_planning": TreatmentMessage,
    "styling": StylingMessage,
}


def parse_json_field(field):
    if isinstance(field, dict):
        return field
    try:
        return json.loads(field)
    except Exception:
        return {}


def get_user_session_data(db: Session, user_id: str, feature_type: str) -> dict:
    profile = get_or_create_user_profile(db, user_id)
    ModelClass = MODEL_MAP.get(feature_type, ChatMessage)

    history = (
        db.query(ModelClass)
        .filter(ModelClass.user_id == user_id, ModelClass.type == feature_type)
        .order_by(ModelClass.timestamp.desc())
        .limit(10)
        .all()
    )
    responses = []
    for msg in history:
        resp = json.loads(msg.response) if isinstance(msg.response, str) else msg.response
        if isinstance(resp, list):
            responses.extend(resp)
        else:
            responses.append(resp)
    return {
        "chat_history": responses,
        "skin_type": profile.skin_type,
        "lifestyle": profile.lifestyle,
        "concern": profile.concern,
        "preferred_routine": profile.preferred_routine,
    }


def get_user_chat_data(db: Session, user_id: str, chat_id: str) -> dict:
    existing = (
        db.query(ChatResults)
        .filter(ChatResults.user_id == user_id, ChatResults.chat_id == chat_id)
        .first()
    )
    if existing:
        return {"results": existing.results.replace("\n", "").replace("\r", "")}

    history = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user_id, ChatMessage.id == chat_id)
        .all()
    )
    responses = []
    for msg in history:
        resp = json.loads(msg.response) if isinstance(msg.response, str) else msg.response
        if isinstance(resp, list):
            responses.extend(resp)
        else:
            responses.append(resp)
    return {"chat_history": responses}


def save_chat_message(db: Session, user_id: str, type: str, message: str, response: str):
    ModelClass = MODEL_MAP.get(type, ChatMessage)
    profile = get_or_create_user_profile(db, user_id)
    profile.last_active = datetime.utcnow()

    existing_chat = db.query(ModelClass).filter_by(user_id=user_id, type=type).first()
    if existing_chat:
        existing_chat.message = message
        existing_chat.type = type
        existing_chat.response = response
        existing_chat.timestamp = datetime.utcnow()
    else:
        existing_chat = ModelClass(
            user_id=user_id,
            type=type,
            message=message,
            response=response,
            timestamp=datetime.utcnow(),
        )
        db.add(existing_chat)

    db.commit()
    return existing_chat


def fetch_chat_history(db: Session, user_id: str, limit: int = 20):
    return (
        db.query(ChatMessage)
        .filter_by(user_id=user_id)
        .order_by(ChatMessage.timestamp.desc())
        .limit(limit)
        .all()
    )
