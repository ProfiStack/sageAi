import asyncio
from concurrent.futures import ThreadPoolExecutor
import datetime
import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
import anthropic
from sqlalchemy.orm import Session

from core.database import SessionLocal
from models.b2b_models import B2BFaceScan, B2BUser
from models.b2b_schemas import CreateB2BUserRequest
from prompts.image_analysis import clean_and_parse_json, get_image_analysis_prompt
from routers.b2b.auth import get_db, verify_b2b_bearer
from services.skin_analyzer import EnhancedFacialSkinAnalyzer

router = APIRouter(tags=["B2B"])

executor = ThreadPoolExecutor()
load_dotenv()
claude = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

_analyzer = None


def get_analyzer() -> EnhancedFacialSkinAnalyzer:
    global _analyzer
    if _analyzer is None:
        _analyzer = EnhancedFacialSkinAnalyzer()
    return _analyzer


@router.post("/users")
def create_b2b_user(
    payload: CreateB2BUserRequest,
    client_id: str = Depends(verify_b2b_bearer),
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

    return {
        "id": user.id,
        "external_user_id": user.external_user_id,
        "email": user.email,
        "client_id": user.client_id,
        "source": user.source,
        "consent": user.consent,
        "created_at": user.created_at,
    }


@router.get("/users")
def list_b2b_users(
    client_id: str = Depends(verify_b2b_bearer),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 50,
):
    users = (
        db.query(B2BUser)
        .filter_by(client_id=client_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        {
            "id": u.id,
            "external_user_id": u.external_user_id,
            "email": u.email,
            "source": u.source,
            "consent": u.consent,
            "created_at": u.created_at,
        }
        for u in users
    ]


@router.get("/users/{user_id}")
def get_b2b_user(
    user_id: str,
    client_id: str = Depends(verify_b2b_bearer),
    db: Session = Depends(get_db),
):
    user = (
        db.query(B2BUser)
        .filter_by(id=user_id, client_id=client_id)
        .first()
    )
    if not user:
        raise HTTPException(404, "User not found")
    return {
        "id": user.id,
        "external_user_id": user.external_user_id,
        "email": user.email,
        "source": user.source,
        "consent": user.consent,
        "created_at": user.created_at,
    }


@router.post("/users/{user_id}/scan")
async def create_face_scan(
    user_id: str,
    client_id: str = Depends(verify_b2b_bearer),
    db: Session = Depends(get_db),
    image: UploadFile = File(..., description="The image to analyze"),
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image type")

    user = (
        db.query(B2BUser)
        .filter_by(id=user_id, client_id=client_id)
        .first()
    )
    if not user:
        raise HTTPException(404, "User not found")

    image_bytes = await image.read()

    try:
        analyzer = get_analyzer()
        # analyze() returns: {skin_type, concerns (list[str]), tone, undertone, texture, under_eye, lip_color}
        result = await asyncio.get_event_loop().run_in_executor(
            executor, analyzer.analyze, image_bytes
        )

        scan = B2BFaceScan(
            b2b_user_id=user.id,
            skin_type=result.get("skin_type"),
            skin_type_confidence=None,
            concerns=result.get("concerns", []),
            concerns_confidence=None,
            tone=result.get("tone"),
            tone_confidence=None,
            undertone=result.get("undertone"),
            undertone_confidence=None,
            texture=result.get("texture"),
            texture_confidence=None,
            under_eye=result.get("under_eye"),
            under_eye_confidence=None,
            lip_color=result.get("lip_color"),
            lip_color_confidence=None,
            scan_version="v1",
            created_at=datetime.datetime.now(datetime.timezone.utc),
        )
        db.add(scan)
        db.commit()
        db.refresh(scan)

        system_prompt = get_image_analysis_prompt(result)
        response = await asyncio.get_event_loop().run_in_executor(
            executor,
            lambda: claude.messages.create(
                model="claude-haiku-4-5-20251001",
                system=system_prompt,
                messages=[{"role": "user", "content": "Analyze the skin data and return the JSON response."}],
                max_tokens=4096,
                temperature=0.7,
            ),
        )

        json_result = clean_and_parse_json(response.content[0].text)
        return {"scan_id": scan.id, "results": json_result}

    except HTTPException:
        raise
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})
