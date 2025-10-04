# routes/payments.py
from decimal import Decimal
import os
from typing import Annotated
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from models.schemas import SubscriptionRequest
from routers.auth import get_current_user
from services.payments import (
    cancel_user_subscription,
    create_one_time_checkout,
    create_payment_intent,
    create_subscription_checkout,
    handle_stripe_webhook,
)
from stripe import stripe

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


user_dependency = Annotated[Session, Depends(get_current_user)]


@router.post("/create")
def create_payment(
    amount_cents: int, user_db: user_dependency, db: Session = Depends(get_db)
):
    user_id = user_db.get("user_id")
    """
    Create a one-time PaymentIntent and return client_secret.
    amount_cents: integer (e.g., $10.00 = 1000)
    """
    try:
        result = create_payment_intent(db, user_id=user_id, amount_cents=amount_cents)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/subscribe")
async def subscribe(
    req: SubscriptionRequest, user_db: user_dependency, db: Session = Depends(get_db)
):
    """
    Create a subscription Checkout session.
    price_id: Stripe Price ID for recurring plan.
    """
    try:
        success_url = os.getenv("SUCCESS_URL") + "/success"
        cancel_url = os.getenv("CANCEL_URL") + "/home"
        result = await create_subscription_checkout(
            price_id=req.price_id,
            success_url=success_url,
            cancel_url=cancel_url,
            user_db=user_db,
            db=db,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/un-subscribe")
async def unsubscribe(user_db: user_dependency, db: Session = Depends(get_db)):
    user_id = user_db.get("user_id")
    try:
        result = await cancel_user_subscription(
            user_id,
            db=db,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature") or request.headers.get(
        "Stripe-Signature"
    )
    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing Stripe-Signature header")
    try:
        result = await handle_stripe_webhook(payload, sig_header, db)
        return result
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/prices")
async def getPrices():
    prices = stripe.Price.list(
        product=os.getenv("STRIPE_PRODUCT_ID"), expand=["data.currency_options"]
    )
    # return prices;
    return {
        "gbp": float(
            Decimal(prices["data"][0]["currency_options"]["gbp"]["unit_amount_decimal"])
            / 100
        ),
        "usd": float(
            Decimal(prices["data"][0]["currency_options"]["usd"]["unit_amount_decimal"])
            / 100
        ),
    }


@router.post("/pay")
async def pay_once(
    body: SubscriptionRequest,
    user_db: user_dependency,
    db: Session = Depends(get_db),
):
    try:
        success_url = os.getenv("SUCCESS_URL") + "/success"
        cancel_url = os.getenv("CANCEL_URL") + "/home"

        return await create_one_time_checkout(
            price_id=body.price_id,
            type=body.type,
            success_url=success_url,
            cancel_url=cancel_url,
            user_db=user_db,
            db=db,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
