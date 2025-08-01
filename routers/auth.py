from typing import Annotated
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError; 
from sqlalchemy import Column
from sqlalchemy.orm import Session
from db import SessionLocal
from models.db_models import UserProfile
from models.schemas import AccessTokenResponse, LoginRequest, LoginResponse
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
import os;

load_dotenv(override=True)

OAUTH2_BEARER = OAuth2PasswordBearer(tokenUrl='auth/login')
router = APIRouter()
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



async def get_current_user(token: Annotated[str, Depends(OAUTH2_BEARER)]):
    try:
        payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=[os.getenv('ALOGORITHM')])  # ← Fix typo
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

get_dependency = Annotated[Session, Depends(get_current_user)]

async def get_hashed_password(profile, password):
    if not bcrypt_context.verify(password, profile.hashed_password): # type: ignore
        raise HTTPException(status_code= status.HTTP_401_UNAUTHORIZED, detail='Please enter correct password');
    return True;

def create_access_token(email_phone:Column[str], user_id: Column[int], name: Column[str], expires_delta: timedelta) -> AccessTokenResponse:
    encode = {'sub': email_phone, 'user_id': user_id, 'name': name}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    token = jwt.encode(encode, s.getenv('SECRET_KEY'), algorithm=os.getenv('ALOGORITHM'))
    return AccessTokenResponse(access='Bearer', token=token)




@router.post("/auth/login", response_model=AccessTokenResponse)
async def login_user(data: LoginRequest, db: Session = Depends(get_db)):
    print(data);
    if not data.email and not data.phone_number or not data.password:
        raise HTTPException(status_code=400, detail="Please enter correct details.")

    query = db.query(UserProfile)

    if data.email:
        profile = query.filter_by(email=data.email).first()
    else:
        profile = query.filter_by(phone_number=data.phone_number).first()
    if profile and profile.hashed_password:
        check_hashed_password = await get_hashed_password(profile, data.password)
        if check_hashed_password:
            profile.last_active = datetime.now(timezone.utc)
            db.commit()
            return create_access_token(profile.email or profile.phone_number, profile.user_id, profile.name, timedelta(days=1))
        else:
            raise HTTPException(status_code=401, detail="Incorrect password.")

    if profile and not profile.hashed_password:
        profile.hashed_password = bcrypt_context.hash(data.password)
        profile.last_active = datetime.now(timezone.utc)
        db.commit()
        return create_access_token(
            profile.email or profile.phone_number,
            profile.user_id,
            profile.name,
            timedelta(days=1)
        )
    # Create new user if not found
    new_profile = UserProfile(
        email=data.email,
        hashed_password=bcrypt_context.hash(data.password),
        phone_number=data.phone_number,
        created_at=datetime.now(timezone.utc),
        last_active=datetime.now(timezone.utc)
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return create_access_token(new_profile.email or new_profile.phone_number, new_profile.user_id, new_profile.name, timedelta(days=1))
    