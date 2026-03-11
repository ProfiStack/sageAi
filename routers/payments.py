from typing import Annotated
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user
from schemas.payment import SubscriptionRequest
from controllers.payment_controller import (
    create_payment,
    subscribe,
    unsubscribe,
    stripe_webhook,
    get_prices,
    pay_once,
)

router = APIRouter()
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.post("/create")
def payment_create(amount_cents: int, user_db: user_dependency, db: Session = Depends(get_db)):
    return create_payment(amount_cents, user_db, db)


@router.post("/subscribe")
async def payment_subscribe(req: SubscriptionRequest, user_db: user_dependency, db: Session = Depends(get_db)):
    return await subscribe(req, user_db, db)


@router.get("/un-subscribe")
async def payment_unsubscribe(user_db: user_dependency, db: Session = Depends(get_db)):
    return await unsubscribe(user_db, db)


@router.post("/webhook")
async def payment_webhook(request: Request, db: Session = Depends(get_db)):
    return await stripe_webhook(request, db)


@router.get("/prices")
async def payment_prices():
    return await get_prices()


@router.post("/pay")
async def payment_pay(body: SubscriptionRequest, user_db: user_dependency, db: Session = Depends(get_db)):
    return await pay_once(body, user_db, db)
