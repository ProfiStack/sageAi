import os
from decimal import Decimal
from fastapi import HTTPException, Request
from sqlalchemy.orm import Session

import stripe
from stripe import stripe as stripe_module

from schemas.payment import SubscriptionRequest
from services.payment_service import (
    cancel_user_subscription,
    create_one_time_checkout,
    create_payment_intent,
    create_subscription_checkout,
    handle_stripe_webhook,
)


def create_payment(amount_cents: int, user_db: dict, db: Session) -> dict:
    user_id = user_db.get("user_id")
    try:
        return create_payment_intent(db=db, user_id=user_id, amount_cents=amount_cents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def subscribe(req: SubscriptionRequest, user_db: dict, db: Session) -> dict:
    try:
        success_url = os.getenv("SUCCESS_URL") + "/success"
        cancel_url = os.getenv("CANCEL_URL") + "/home"
        return await create_subscription_checkout(
            price_id=req.price_id,
            success_url=success_url,
            cancel_url=cancel_url,
            user_db=user_db,
            db=db,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def unsubscribe(user_db: dict, db: Session) -> dict:
    user_id = user_db.get("user_id")
    try:
        return await cancel_user_subscription(user_id, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def stripe_webhook(request: Request, db: Session) -> dict:
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature") or request.headers.get("Stripe-Signature")
    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing Stripe-Signature header")
    try:
        return await handle_stripe_webhook(payload, sig_header, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


async def get_prices() -> dict:
    prices = stripe_module.Price.list(
        product=os.getenv("STRIPE_PRODUCT_ID"), expand=["data.currency_options"]
    )
    return {
        "gbp": float(
            Decimal(prices["data"][0]["currency_options"]["gbp"]["unit_amount_decimal"]) / 100
        ),
        "usd": float(
            Decimal(prices["data"][0]["currency_options"]["usd"]["unit_amount_decimal"]) / 100
        ),
    }


async def pay_once(body: SubscriptionRequest, user_db: dict, db: Session) -> dict:
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
