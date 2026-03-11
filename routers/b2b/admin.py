"""
B2B Admin endpoints — used by your internal team to onboard businesses.
Protected by a static ADMIN_SECRET environment variable.
"""
import hashlib
import os
import secrets
import datetime

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from core.database import SessionLocal
from models.b2b_models import B2BApiKey, B2BClient


router = APIRouter(prefix="/admin", tags=["B2B Admin"])


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def require_admin(x_admin_secret: str = Header(...)):
    """Simple static secret guard for admin endpoints."""
    expected = os.getenv("ADMIN_SECRET")
    if not expected:
        raise HTTPException(500, "ADMIN_SECRET not configured")
    if x_admin_secret != expected:
        raise HTTPException(403, "Forbidden")


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class CreateClientRequest(BaseModel):
    name: str
    email: str
    first_key_label: Optional[str] = "default"


class CreateKeyRequest(BaseModel):
    label: Optional[str] = None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/clients", dependencies=[Depends(require_admin)], status_code=201)
def create_client(payload: CreateClientRequest, db: Session = Depends(get_db)):
    """
    Onboard a new business. Creates the B2BClient record and generates the
    first API key, returning the raw key (shown once — store it safely).
    """
    existing = db.query(B2BClient).filter_by(email=payload.email).first()
    if existing:
        raise HTTPException(409, f"Client with email '{payload.email}' already exists")

    client = B2BClient(
        name=payload.name,
        email=payload.email,
        status="active",
        created_at=datetime.datetime.utcnow(),
    )
    db.add(client)
    db.flush()  # get client.id before creating the key

    raw_key, key_record = _create_api_key(db, client.id, payload.first_key_label)
    db.commit()

    return {
        "client_id": client.id,
        "name": client.name,
        "email": client.email,
        "status": client.status,
        "api_key": raw_key,         # shown once — instruct client to store it
        "api_key_id": key_record.id,
        "api_key_label": key_record.label,
        "warning": "Store the api_key securely. It will not be shown again.",
    }


@router.get("/clients", dependencies=[Depends(require_admin)])
def list_clients(db: Session = Depends(get_db), skip: int = 0, limit: int = 50):
    clients = db.query(B2BClient).offset(skip).limit(limit).all()
    return [
        {
            "client_id": c.id,
            "name": c.name,
            "email": c.email,
            "status": c.status,
            "created_at": c.created_at,
        }
        for c in clients
    ]


@router.patch("/clients/{client_id}/status", dependencies=[Depends(require_admin)])
def set_client_status(
    client_id: str,
    status: str,
    db: Session = Depends(get_db),
):
    """Activate or deactivate a client ('active' | 'inactive')."""
    if status not in ("active", "inactive"):
        raise HTTPException(400, "status must be 'active' or 'inactive'")
    client = db.query(B2BClient).filter_by(id=client_id).first()
    if not client:
        raise HTTPException(404, "Client not found")
    client.status = status
    db.commit()
    return {"client_id": client_id, "status": status}


@router.post("/clients/{client_id}/keys", dependencies=[Depends(require_admin)], status_code=201)
def create_api_key(
    client_id: str,
    payload: CreateKeyRequest,
    db: Session = Depends(get_db),
):
    """Generate a new API key for an existing client."""
    client = db.query(B2BClient).filter_by(id=client_id).first()
    if not client:
        raise HTTPException(404, "Client not found")
    if client.status != "active":
        raise HTTPException(400, "Cannot create keys for an inactive client")

    raw_key, key_record = _create_api_key(db, client_id, payload.label)
    db.commit()

    return {
        "api_key_id": key_record.id,
        "api_key": raw_key,
        "label": key_record.label,
        "created_at": key_record.created_at,
        "warning": "Store the api_key securely. It will not be shown again.",
    }


@router.get("/clients/{client_id}/keys", dependencies=[Depends(require_admin)])
def list_api_keys(client_id: str, db: Session = Depends(get_db)):
    client = db.query(B2BClient).filter_by(id=client_id).first()
    if not client:
        raise HTTPException(404, "Client not found")
    keys = db.query(B2BApiKey).filter_by(client_id=client_id).all()
    return [
        {
            "api_key_id": k.id,
            "label": k.label,
            "is_active": k.is_active,
            "created_at": k.created_at,
            "last_used_at": k.last_used_at,
        }
        for k in keys
    ]


@router.delete("/clients/{client_id}/keys/{key_id}", dependencies=[Depends(require_admin)])
def revoke_api_key(client_id: str, key_id: str, db: Session = Depends(get_db)):
    key = (
        db.query(B2BApiKey)
        .filter_by(id=key_id, client_id=client_id)
        .first()
    )
    if not key:
        raise HTTPException(404, "API key not found")
    key.is_active = False
    db.commit()
    return {"api_key_id": key_id, "is_active": False}


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _create_api_key(db: Session, client_id: str, label: Optional[str]) -> tuple[str, B2BApiKey]:
    raw_key = secrets.token_urlsafe(32)
    hashed = hashlib.sha256(raw_key.encode()).hexdigest()
    record = B2BApiKey(
        client_id=client_id,
        label=label,
        api_key_hash=hashed,
        is_active=True,
        created_at=datetime.datetime.utcnow(),
    )
    db.add(record)
    return raw_key, record
