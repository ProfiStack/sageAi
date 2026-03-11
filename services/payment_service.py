import os
import stripe
from datetime import datetime
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from models.db_models import Payment, UserProfile
from repositories.payment_repository import (
    update_payment_status,
    update_subscription_record,
    update_subscriptions_for_new_payment,
)

load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


def create_payment_intent(
    amount_cents: int,
    user_db: dict,
    db: Session,
    currency: str = "usd",
    description: str = None,
):
    """Create one-time PaymentIntent and record it."""
    user_id = user_db.get("user_id")
    intent = stripe.PaymentIntent.create(
        amount=amount_cents,
        currency=currency,
        description=description,
        metadata={"user_id": user_id},
    )
    payment = Payment(
        user_id=user_id,
        amount=str(amount_cents),
        currency=currency,
        status="pending",
        stripe_payment_intent_id=intent.id,
        description=description,
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return {"client_secret": intent.client_secret, "payment_id": payment.id}


async def create_subscription_checkout(
    price_id: str, success_url: str, cancel_url: str, user_db: dict, db: Session
):
    """Create a Stripe Checkout Session for a recurring subscription."""
    user_id = user_db.get("user_id")
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"user_id": user_id},
    )
    payment = Payment(
        user_id=user_id,
        amount="0",
        currency="usd",
        status="pending",
        description="subscription_checkout",
        stripe_subscription_id=None,
        email="pending",
        name="pending",
        stripe_customer_id="pending",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return {"checkout_url": session.url, "session_id": session.id}


async def create_one_time_checkout(
    *,
    price_id: str,
    type: str,
    success_url: str,
    cancel_url: str,
    user_db: dict,
    db: Session,
):
    """Create a one-time Checkout Session using a Stripe Price (non-recurring)."""
    price = stripe.Price.retrieve(price_id, expand=["currency_options", "product"])

    if price.get("recurring"):
        raise ValueError("Provided price_id is recurring. Use the subscription endpoint.")

    user_id = user_db.get("user_id")

    payment = Payment(
        user_id=user_id,
        amount="0",
        currency="usd",
        status="pending",
        description="subscription_checkout",
        stripe_subscription_id=None,
        email="pending",
        name="pending",
        type=type,
        stripe_customer_id="pending",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    session = stripe.checkout.Session.create(
        mode="payment",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": str(user_id),
            "payment_id": str(payment.id),
            "kind": "one_time_price",
            "price_id": price_id,
        },
        customer_creation="always",
        allow_promotion_codes=False,
        automatic_tax={"enabled": False},
    )

    return {
        "checkout_url": session.url,
        "session_id": session.id,
        "payment_id": payment.id,
    }


async def handle_stripe_webhook(payload: bytes, sig_header: str, db: Session):
    try:
        endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
        if not endpoint_secret:
            raise ValueError("STRIPE_WEBHOOK_SECRET not configured")

        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)

        typ = event.get("type")
        obj = event.get("data", {}).get("object", {})
        user_id = None

        if typ == "payment_intent.succeeded":
            update_payment_status(obj["id"], "succeeded", db)
            return {"status": "ok"}

        elif typ == "payment_intent.payment_failed":
            update_payment_status(obj["id"], "failed", db)
            return {"status": "ok"}

        elif typ == "checkout.session.completed":
            s = obj
            mode = s.get("mode")
            md = s.get("metadata") or {}
            user_id = md.get("user_id")
            payment_id = md.get("payment_id")
            kind = md.get("kind")
            amount_total = s.get("amount_total")
            currency = s.get("currency")
            payment_intent_id = s.get("payment_intent")
            sub_id = s.get("subscription")
            customer_id = s.get("customer")
            cust = s.get("customer_details") or {}
            cust_email = cust.get("email")
            cust_name = cust.get("name")

            if mode == "payment" and kind in ("one_time", "one_time_price"):
                p = db.query(Payment).filter(Payment.id == payment_id).first() if payment_id else None
                if not p and user_id:
                    p = (
                        db.query(Payment)
                        .filter(Payment.user_id == user_id, Payment.status == "pending")
                        .order_by(Payment.created_at.desc())
                        .first()
                    )
                if p:
                    p.status = "succeeded" if s.get("payment_status") == "paid" else "pending"
                    p.stripe_payment_intent_id = payment_intent_id
                    if amount_total is not None:
                        p.amount = str(amount_total)
                    if currency:
                        p.currency = currency
                    if customer_id:
                        p.stripe_customer_id = customer_id
                    if cust_email and (not p.email or p.email == "pending"):
                        p.email = cust_email
                    if cust_name and (not p.name or p.name == "pending"):
                        p.name = cust_name
                    presentment = s.get("presentment_details") or {}
                    try:
                        pres_amt = presentment.get("presentment_amount")
                        pres_cur = presentment.get("presentment_currency")
                        if hasattr(p, "presentment_amount_cents") and pres_amt is not None:
                            p.presentment_amount_cents = pres_amt
                        if hasattr(p, "presentment_currency") and pres_cur:
                            p.presentment_currency = pres_cur
                    except Exception:
                        pass
                    p.updated_at = datetime.utcnow()
                    db.commit()
                return {"status": "ok"}

            elif sub_id:
                p = (
                    db.query(Payment)
                    .filter(Payment.user_id == user_id, Payment.status == "pending")
                    .order_by(Payment.created_at.desc())
                    .first()
                )
                if p:
                    p.stripe_subscription_id = sub_id
                    if customer_id:
                        p.stripe_customer_id = customer_id
                    if payment_intent_id:
                        p.stripe_payment_intent_id = payment_intent_id
                    if amount_total is not None:
                        p.amount = str(amount_total)
                    if currency:
                        p.currency = currency
                    if cust_email and (not p.email or p.email == "pending"):
                        p.email = cust_email
                    if cust_name and (not p.name or p.name == "pending"):
                        p.name = cust_name
                    p.updated_at = datetime.utcnow()
                    db.commit()
                return {"status": "ok"}

        elif typ in (
            "customer.subscription.created",
            "customer.subscription.updated",
            "customer.subscription.deleted",
            "invoice.payment_succeeded",
            "invoice.payment_failed",
        ):
            if typ == "invoice.payment_succeeded":
                inv = obj
                sub_id = inv.get("subscription")
                current_period_end = None
                try:
                    line = (inv.get("lines", {}).get("data") or [])[0]
                    current_period_end = line.get("period", {}).get("end")
                except Exception:
                    pass

                email = inv.get("customer_email")
                name = inv.get("customer_name")
                amount_paid = inv.get("amount_paid")
                currency = inv.get("currency")

                payment = (
                    db.query(Payment)
                    .filter_by(stripe_subscription_id=sub_id)
                    .order_by(Payment.created_at.desc())
                    .first()
                )
                user_id = payment.user_id if payment else None

                if user_id:
                    await update_subscriptions_for_new_payment(db, user_id, sub_id)
                if payment:
                    payment.status = "active"
                    if amount_paid is not None:
                        payment.amount = str(amount_paid)
                    if currency:
                        payment.currency = currency
                    if email and (not payment.email or payment.email == "pending"):
                        payment.email = email
                    if name and (not payment.name or payment.name == "pending"):
                        payment.name = name
                    payment.updated_at = datetime.utcnow()
                    db.commit()

                await update_subscription_record(
                    db=db,
                    user_id=user_id,
                    subscription_id=sub_id,
                    customer_id=inv.get("customer"),
                    email=email,
                    name=name,
                    status="active",
                    current_period_end=current_period_end,
                )
                return {"status": "ok"}

            elif typ == "invoice.payment_failed":
                inv = obj
                sub_id = inv.get("subscription")
                payment = (
                    db.query(Payment)
                    .filter_by(stripe_subscription_id=sub_id)
                    .order_by(Payment.created_at.desc())
                    .first()
                )
                user_id = payment.user_id if payment else None

                if payment:
                    payment.status = "past_due"
                    payment.updated_at = datetime.utcnow()
                    db.commit()

                await update_subscription_record(
                    db=db,
                    user_id=user_id,
                    subscription_id=sub_id,
                    customer_id=inv.get("customer"),
                    email=inv.get("customer_email"),
                    name=inv.get("customer_name"),
                    status="past_due",
                    current_period_end=None,
                )
                return {"status": "ok"}

            else:
                sub = obj
                sub_id = sub.get("id")
                status = sub.get("status")
                customer_id = sub.get("customer")
                current_period_end = sub.get("current_period_end")

                payment = (
                    db.query(Payment)
                    .filter_by(stripe_subscription_id=sub_id)
                    .order_by(Payment.created_at.desc())
                    .first()
                )
                user_id = payment.user_id if payment else None

                if payment:
                    if status:
                        payment.status = status
                    payment.updated_at = datetime.utcnow()
                    db.commit()

                await update_subscription_record(
                    db=db,
                    user_id=user_id,
                    subscription_id=sub_id,
                    customer_id=customer_id,
                    email=None,
                    name=None,
                    status=status or "unknown",
                    current_period_end=current_period_end,
                )
                return {"status": "ok"}

        return {"status": "ignored"}

    except Exception as e:
        raise e


async def cancel_user_subscription(user_id: str, db: Session):
    payment = (
        db.query(Payment)
        .filter(Payment.user_id == user_id, Payment.status == "active")
        .first()
    )
    if not payment or not payment.stripe_subscription_id:
        return {"error": "No active subscription found for user."}

    subscription_id = payment.stripe_subscription_id

    try:
        stripe.Subscription.delete(subscription_id)

        payment.status = "canceled"
        db.commit()

        user = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if user:
            user.subscription_status = "canceled"
            db.commit()

        return {"success": True, "message": "Subscription canceled."}

    except Exception as e:
        return {"error": str(e)}
