from typing import Annotated
from fastapi import APIRouter, Depends

from core.security import get_current_user
from controllers.user_controller import get_chat_history_by_type, get_chat_history

router = APIRouter()
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/user/history/{type}")
def history_by_type(user_db: user_dependency, type: str, limit: int = 20):
    return get_chat_history_by_type(user_db, type, limit)


@router.get("/user/history")
def history(user_db: user_dependency, limit: int = 20):
    return get_chat_history(user_db, limit)
