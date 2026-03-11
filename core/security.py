from typing import Annotated
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy import Column
import os

from schemas.auth import AccessTokenResponse

OAUTH2_BEARER = OAuth2PasswordBearer(tokenUrl='auth/login')
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


async def get_current_user(token: Annotated[str, Depends(OAUTH2_BEARER)]):
    try:
        payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=[os.getenv('ALGORITHM')])
        email_phone: str = payload.get('sub', None)
        user_id: str = payload.get('user_id', None)
        name: str = payload.get('name', None)
        if email_phone is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='User not found'
            )
        return {'name': name, 'user_id': user_id, 'email_phone': email_phone}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')


get_dependency = Annotated[dict, Depends(get_current_user)]


async def get_hashed_password(profile, password):
    if not bcrypt_context.verify(password, profile.hashed_password):  # type: ignore
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Please enter correct password')
    return True


def create_access_token(
    email_phone: Column[str],
    user_id: Column[int],
    name: Column[str],
    subscription_status: Column[str],
    expires_delta: timedelta
) -> AccessTokenResponse:
    encode = {'sub': email_phone, 'user_id': user_id, 'name': name}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    token = jwt.encode(encode, os.getenv('SECRET_KEY'), algorithm=os.getenv('ALGORITHM'))
    subscription = subscription_status == 'active'
    return AccessTokenResponse(access='Bearer', token=token, subscription=subscription)
