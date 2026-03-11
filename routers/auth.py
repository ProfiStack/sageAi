from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
# Re-export for legacy imports from other routers (will be removed after all routers are updated)
from core.security import get_current_user, OAUTH2_BEARER, bcrypt_context, create_access_token, get_dependency  # noqa: F401
from schemas.auth import AccessTokenResponse, LoginRequest
from controllers.auth_controller import login_user

router = APIRouter()


@router.post("/auth/login", response_model=AccessTokenResponse)
async def login(data: LoginRequest, db: Session = Depends(get_db)):
    return await login_user(data, db)
