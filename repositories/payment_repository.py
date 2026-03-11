from datetime import datetime
from sqlalchemy.orm import Session

from models.db_models import Payment, UserProfile


def get_user_payments(db: Session, user_id: str):
    return db.query(Payment).filter(Payment.user_id == user_id).first()


def update_payment_status(payment_intent_id: str, status: str, db: Session):
    payment = db.query(Payment).filter_by(stripe_payment_intent_id=payment_intent_id).first()
    if payment:
        payment.status = status
        payment.updated_at = datetime.now()
        db.commit()
    return payment


async def update_subscription_record(
    db: Session,
    user_id: str,
    subscription_id: str,
    customer_id: str,
    email: str,
    name: str,
    status: str,
    current_period_end: int = None,
):
    payment = db.query(Payment).filter_by(stripe_subscription_id=subscription_id).first()
    if payment:
        payment.status = status
        payment.stripe_customer_id = customer_id
        payment.email = email
        payment.name = name
        payment.updated_at = datetime.now()

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


async def update_subscriptions_for_new_payment(db: Session, user_id: str, new_sub_id: str):
    db.query(Payment).filter(
        Payment.user_id == user_id,
        Payment.stripe_subscription_id != new_sub_id
    ).update({"status": "inactive"}, synchronize_session=False)
    db.commit()
