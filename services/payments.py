# services/payments.py
import email
import os
from typing import Annotated
from fastapi import Depends
import stripe
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from db import SessionLocal
from models.db_models import Payment, UserProfile
from dotenv import load_dotenv

from routers.auth import get_current_user

load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


user_dependency = Annotated[Session, Depends(get_current_user)]


def create_payment_intent(
    amount_cents: int,
    user_db: user_dependency,
    db: Session = Depends(get_db),
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


def create_subscription_checkout(
    price_id: str, success_url: str, cancel_url: str, user_db, db
):
    """
    Create a Stripe Checkout Session for a recurring subscription.
    price_id is the Stripe Price (recurring) ID configured in Stripe dashboard.
    """
    user_id = user_db.get("user_id")
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"user_id": user_id},
    )

    # create a placeholder Payment record (we'll update it on webhook)
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


def update_payment_status(payment_intent_id: str, status: str, db: Session):
    payment = (
        db.query(Payment).filter_by(stripe_payment_intent_id=payment_intent_id).first()
    )
    if payment:
        payment.status = status
        payment.updated_at = datetime.now()
        db.commit()
    return payment


async def update_subscription_record(
    db,
    user_id,
    subscription_id: str,
    customer_id: str,
    email: str,
    name: str,
    status: str,
    current_period_end: int = None,
):
    payment = (
        db.query(Payment).filter_by(stripe_subscription_id=subscription_id).first()
    )
    if payment:
        payment.status = status
        payment.stripe_customer_id = customer_id
        payment.email = email
        payment.name = name
        payment.updated_at = datetime.now()

    # update user profile subscription status
    user = db.query(UserProfile).filter_by(user_id=user_id).first()
    if user:
        user.subscription_status = "active" if status == "active" else status
        if current_period_end:
            try:
                user.subscription_end = datetime.fromtimestamp(current_period_end)
            except Exception:
                user.subscription_end = None
        db.commit()
    return payment


async def update_subscriptions_for_new_payment(db, user_id, new_sub_id):
    db.query(Payment).filter(
        Payment.user_id == user_id, Payment.stripe_subscription_id != new_sub_id
    ).update({"status": "inactive"}, synchronize_session=False)
    # Commit the transaction
    db.commit()
    return


async def handle_stripe_webhook(payload: bytes, sig_header: str, db: Session):
    try:
      endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
      user_id = None
      try:
          event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
      except Exception as e:
          raise e

      typ = event["type"]
      obj = event["data"]["object"]

      # One-time payment succeeded
      if typ == "payment_intent.succeeded":
          update_payment_status(obj["id"], "succeeded", db)

      # Payment failed
      elif typ == "payment_intent.payment_failed":
          update_payment_status(obj["id"], "failed", db)

      # Checkout session completed for subscription — session contains subscription id
      elif typ == "checkout.session.completed":
          session_obj = obj
          sub_id = session_obj.get("subscription")
          customer_id = session_obj.get("customer")
          metadata = session_obj.get("metadata", {})
          user_id = metadata.get("user_id")
          payment_intent_id = obj["id"]
          amount = obj["amount_total"]
          currency = obj["currency"]
          # update payment record for subscription (link subscription id)
          if sub_id:
              p = (
                  db.query(Payment)
                  .filter_by(user_id=user_id, status="pending")
                  .order_by(Payment.created_at.desc())
                  .first()
              )
              if p:
                  p.stripe_subscription_id = sub_id
                  p.stripe_customer_id = customer_id
                  p.stripe_payment_intent_id = payment_intent_id
                  p.amount = amount / 100
                  p.currency = currency
                  db.commit()

      # Subscription lifecycle events
      elif typ in (
          "customer.subscription.created",
          "customer.subscription.updated",
          "customer.subscription.deleted",
          "invoice.payment_succeeded",
          "invoice.payment_failed",
      ):
          sub = obj

          if typ == "invoice.payment_succeeded":
              current_period_end = sub.get("period_end")
              sub_id = (
                  sub.get("parent", {})
                  .get("subscription_details", {})
                  .get("subscription")
              )
              status = sub.get("status") or (
                  "active" if typ == "invoice.payment_succeeded" else "unknown"
              )
              status = "active"
              email = sub.get("customer_email")
              name = sub.get("customer_name")
              print(sub.get("customer"))
              print(sub)
              if not user_id:
                  payment_record = (
                      db.query(Payment).filter_by(stripe_subscription_id=sub_id).first()
                  )
                  if payment_record:
                      user_id = payment_record.user_id
              if user_id:
                  await update_subscriptions_for_new_payment(db, user_id, sub_id)
                  await update_subscription_record(
                      db,
                      user_id,
                      sub_id,
                      sub.get("customer"),
                      email,
                      name,
                      status,
                      current_period_end,
                  )

      return {"status": "ok"}
    except Exception as e:
      raise e

async def cancel_user_subscription(user_id: int, db: Session):
    # Find the user's active subscription payment record
    payment = (
        db.query(Payment)
        .filter(Payment.user_id == user_id, Payment.status == "active")
        .first()
    )
    if not payment or not payment.stripe_subscription_id:
        return {"error": "No active subscription found for user."}

    subscription_id = payment.stripe_subscription_id

    try:
        # Cancel subscription immediately (or use cancel_at_period_end=True for delayed)
        stripe.Subscription.delete(subscription_id)

        # Update payment record status
        payment.status = "canceled"
        db.commit()

        # Update user profile subscription status
        user = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if user:
            user.subscription_status = "canceled"
            user.subscription_end = datetime.now()  # or datetime.utcnow() if you want to mark cancel date
            db.commit()

        return {"success": True, "message": "Subscription canceled."}

    except Exception as e:
        return {"error": str(e)}