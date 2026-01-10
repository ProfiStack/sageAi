import asyncio
from concurrent.futures import ThreadPoolExecutor
import datetime
import os
from typing import Annotated
import uuid
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from openai import OpenAI
from sqlalchemy.orm import Session
from db import SessionLocal
from models.b2b_models import B2BFaceScan, B2BUser
from models.b2b_schemas import CreateB2BUserRequest
from prompts.image_analysis import get_image_analysis_prompt
from routers.auth import get_current_user
from routers.b2b.auth import verify_b2b_bearer
from services.ai import analyze_skin_features
from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from prompts.image_analysis import clean_and_parse_json, get_image_analysis_prompt
from prompts.shade_matching import get_shade_matching_prompt
from routers.auth import get_current_user
from services.ai import analyze_skin_features
from sqlalchemy.orm import Session

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


executor = ThreadPoolExecutor()
load_dotenv()
chat_gpt = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

user_dependency = Annotated[Session, Depends(get_current_user)]


@router.post("/b2b/users")
def create_b2b_user(
    payload: CreateB2BUserRequest,
    client_id=Depends(verify_b2b_bearer),
    db: Session = Depends(get_db),
):
    user = (
        db.query(B2BUser)
        .filter_by(client_id=client_id, external_user_id=payload.external_user_id)
        .first()
    )

    if not user:
        user = B2BUser(
            client_id=client_id,
            external_user_id=payload.external_user_id,
            email=payload.email,
            source=payload.source,
            consent=payload.consent,
            created_at=datetime.datetime.now(datetime.timezone.utc),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user


@router.post("/b2b/users/{user_id}/scan")
async def create_face_scan(
    user_id: str,
    client_id=Depends(verify_b2b_bearer),
    db: Session = Depends(get_db),
    image: UploadFile = File(..., description="The image to analyze"),
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image type")
    db = SessionLocal()
    image_bytes = await image.read()
    try:
        result = await analyze_skin_features(image_bytes)
        user = (
            db.query(B2BUser)
            .filter_by(id=user_id, client_id=client_id)
            .first()
        )

        if not user:
            raise HTTPException(404, "User not found")

        scan = B2BFaceScan(
            b2b_user_id=user.id,
            skin_type=result["skin_types"]["value"],
            skin_type_confidence=result["skin_types"]["confidence"],
            concerns=[c["value"] for c in result["concerns"]],
            concerns_confidence=[c["confidence"] for c in result["concerns"]],
            tone=result["tone"]["value"],
            tone_confidence=result["tone"]["confidence"],
            undertone=result["undertone"]["value"],
            undertone_confidence=result["undertone"]["confidence"],
            texture=result["texture"]["value"],
            texture_confidence=result["texture"]["confidence"],
            under_eye=result["under_eye"]["value"],
            under_eye_confidence=result["under_eye"]["confidence"],
            lip_color=result["lip_color"]["value"],
            lip_color_confidence=result["lip_color"]["confidence"],
            scan_version="v1",
            created_at=datetime.datetime.now(datetime.timezone.utc),
        )
        message = get_image_analysis_prompt(result)
        messages = [{"role": "system", "content": message}]
        response = await asyncio.get_event_loop().run_in_executor(
            executor,
            lambda: chat_gpt.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7,
            ),
        )
        db.add(scan)
        db.commit()
        db.refresh(scan)
        json_result = response.choices[0].message.content
        json_result = clean_and_parse_json(json_result)
        return {"results": json_result}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})
