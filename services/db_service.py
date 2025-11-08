from sqlalchemy.orm import Session
from models.db_models import (
    Payment,
    UserProfile,
    ChatMessage,
    ChatResults,
    HairMessage,
    StylingMessage,
    HairMessage,
    IngredientMessage,
    NutritionMessage,
    WellnessMessage,
    TrendMessage,
    TreatmentMessage,
)
from datetime import datetime
import json

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


def get_or_create_user_profile(db: Session, user_id: str):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

def get_user_payments(db: Session, user_id: str):
    profile = db.query(Payment).filter(Payment.user_id == user_id).first()
    return profile


def parse_json_field(field):
    if isinstance(field, dict):
        return field
    try:
        return json.loads(field)
    except Exception:
        return {}


def parse_json_field(field):
    if isinstance(field, dict):
        return field
    try:
        return json.loads(field)
    except Exception:
        return {}


def get_user_session_data(db, user_id: str, feature_type: str):
    profile = get_or_create_user_profile(db, user_id)
    # Fetch last 10 chat messages ordered by timestamp descending
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
        resp = (
            json.loads(msg.response) if isinstance(msg.response, str) else msg.response
        )
        if isinstance(resp, list):
            responses.extend(resp)  # flatten list of messages
        else:
            responses.append(resp)  # single message object
    return {
        "chat_history": responses,
        "skin_type": profile.skin_type,
        "lifestyle": profile.lifestyle,
        "concern": profile.concern,
        "preferred_routine": profile.preferred_routine,
    }


def get_user_chat_data(db: Session, user_id: str, chat_id: str):
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
        resp = (
            json.loads(msg.response) if isinstance(msg.response, str) else msg.response
        )
        if isinstance(resp, list):
            responses.extend(resp)
        else:
            responses.append(resp)

    return {"chat_history": responses}


def get_all_user_profiles(db):
    return db.query(UserProfile).all()


def update_user_session_metrics(db, user_id: str, **kwargs):
    profile = get_or_create_user_profile(db, user_id)
    for key in ["skin_type", "lifestyle", "concern", "preferred_routine"]:
        if key in kwargs and kwargs[key] is not None:
            setattr(profile, key, kwargs[key])
    profile.last_active = datetime.utcnow()
    db.commit()


async def update_user_profile(db: Session, user_id: str, updates: dict):
    profile = get_or_create_user_profile(db, user_id)
    for k, v in updates.items():
        if hasattr(profile, k):
            setattr(profile, k, v)
        else:
            print(f"Warning: UserProfile has no attribute '{k}'")

    profile.last_active = datetime.utcnow()

    db.flush()  # flush changes
    db.commit()  # commit transaction

    db.refresh(profile)  # refresh to get latest from DB
    print(profile)
    return profile

async def update_user_payment(db: Session, user_id: str, updates: dict):
    payment = get_user_payments(db, user_id)
    for k, v in updates.items():
        if hasattr(payment, k):
            setattr(payment, k, v)
        else:
            print(f"Warning: Userpayment has no attribute '{k}'")
    db.flush()  # flush changes
    db.commit()  # commit transaction

    db.refresh(payment)  # refresh to get latest from DB
    return payment

def save_chat_message(
    db: Session, user_id: str, type: str, message: str, response: str
):
    # Ensure user profile exists and update last_active
    ModelClass = MODEL_MAP.get(type, ChatMessage)
    profile = get_or_create_user_profile(db, user_id)
    profile.last_active = datetime.utcnow()
    # Check if a chat already exists for the user
    existing_chat = db.query(ModelClass).filter_by(user_id=user_id, type=type).first()

    if existing_chat:
        existing_chat.message = message
        existing_chat.type = type
        existing_chat.response = response
        existing_chat.timestamp = datetime.utcnow()
    else:
        new_chat = ModelClass(
            user_id=user_id,
            type=type,
            message=message,
            response=response,
            timestamp=datetime.utcnow(),
        )
        db.add(new_chat)

    db.commit()
    return existing_chat if existing_chat else new_chat


def fetch_chat_history(db: Session, user_id: str, limit: int = 20):
    return (
        db.query(ChatMessage)
        .filter_by(user_id=user_id)
        .order_by(ChatMessage.timestamp.desc())
        .limit(limit)
        .all()
    )
