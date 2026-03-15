from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.db_models import Review
from schemas.review import ReviewCreate, ReviewListResponse, ReviewResponse, ReviewUpdate


# ── Per-feature cooldown config (days between prompts) ───────────────────────
# 0  = always prompt after every use (no cooldown)
# N  = wait N days after the last submitted review before prompting again
REVIEW_PROMPT_COOLDOWNS: dict[str, int] = {
    "skin_analysis":  0,   # prompt every time — high-value scan
    "shade_matching": 20,  # prompt once per 20 days
    "recommendation": 30,
    "onboarding":     90,
    "general":        30,
}

# ── Helpers ─────────────────────────────────────────────────────────────────

def _get_or_404(review_id: str, db: Session) -> Review:
    review = db.query(Review).filter_by(id=review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


def _avg(reviews: list[Review]) -> float:
    if not reviews:
        return 0.0
    return round(sum(r.rating for r in reviews) / len(reviews), 2)


# ── CRUD ─────────────────────────────────────────────────────────────────────

async def create_review(
    data: ReviewCreate,
    db: Session,
    user_id: Optional[str] = None,
) -> ReviewResponse:
    review = Review(
        user_id=user_id,
        reviewer_name=data.reviewer_name,
        reviewer_country=data.reviewer_country,
        rating=data.rating,
        title=data.title,
        body=data.body,
        feature_tag=data.feature_tag,
        is_published=False,
        is_seeded=False,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return ReviewResponse.model_validate(review)


async def get_review(review_id: str, db: Session) -> ReviewResponse:
    review = _get_or_404(review_id, db)
    return ReviewResponse.model_validate(review)


async def list_reviews(
    db: Session,
    feature_tag: Optional[str] = None,
    published_only: bool = True,
    min_rating: int = 1,
    limit: int = 50,
    offset: int = 0,
) -> ReviewListResponse:
    query = db.query(Review)

    if published_only:
        query = query.filter(Review.is_published == True)          # noqa: E712
    if feature_tag:
        query = query.filter(Review.feature_tag == feature_tag)
    if min_rating > 1:
        query = query.filter(Review.rating >= min_rating)

    total = query.count()
    reviews = query.order_by(Review.created_at.desc()).offset(offset).limit(limit).all()

    return ReviewListResponse(
        total=total,
        reviews=[ReviewResponse.model_validate(r) for r in reviews],
        average_rating=_avg(reviews),
    )


async def update_review(
    review_id: str,
    data: ReviewUpdate,
    db: Session,
    requesting_user_id: Optional[str] = None,
) -> ReviewResponse:
    review = _get_or_404(review_id, db)

    # Only the owner or an admin (no user_id on request = admin path) may edit
    if requesting_user_id and review.user_id and review.user_id != requesting_user_id:
        raise HTTPException(status_code=403, detail="Not authorised to edit this review")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(review, field, value)
    review.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(review)
    return ReviewResponse.model_validate(review)


async def delete_review(
    review_id: str,
    db: Session,
    requesting_user_id: Optional[str] = None,
) -> dict:
    review = _get_or_404(review_id, db)

    if requesting_user_id and review.user_id and review.user_id != requesting_user_id:
        raise HTTPException(status_code=403, detail="Not authorised to delete this review")

    db.delete(review)
    db.commit()
    return {"message": "Review deleted successfully", "id": review_id}


async def publish_review(review_id: str, db: Session) -> ReviewResponse:
    """Admin: toggle publish status."""
    review = _get_or_404(review_id, db)
    review.is_published = not review.is_published
    review.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(review)
    return ReviewResponse.model_validate(review)


async def get_review_prompt_status(
    user_id: str,
    feature_tag: str,
    db: Session,
) -> dict:
    """
    Decide whether to show the review prompt for a given user + feature.

    Rules (controlled entirely server-side):
    - If the user has never reviewed this feature → prompt.
    - cooldown_days == 0  → always prompt (e.g. skin_analysis).
    - cooldown_days >  0  → prompt only after cooldown_days have passed
                            since their last review for this feature.
    """
    cooldown_days = REVIEW_PROMPT_COOLDOWNS.get(feature_tag, 30)

    # Find the most-recent review this user submitted for this feature
    last_review = (
        db.query(Review)
        .filter(Review.user_id == user_id, Review.feature_tag == feature_tag)
        .order_by(Review.created_at.desc())
        .first()
    )

    if not last_review:
        return {"should_prompt": True, "cooldown_days": cooldown_days, "days_remaining": 0}

    if cooldown_days == 0:
        # No cooldown — always prompt even after a previous review
        return {"should_prompt": True, "cooldown_days": 0, "days_remaining": 0}

    # Normalise to UTC-aware datetime for safe arithmetic
    created = last_review.created_at
    if created.tzinfo is None:
        created = created.replace(tzinfo=timezone.utc)

    days_since = (datetime.now(timezone.utc) - created).days

    if days_since >= cooldown_days:
        return {"should_prompt": True, "cooldown_days": cooldown_days, "days_remaining": 0}

    return {
        "should_prompt": False,
        "cooldown_days": cooldown_days,
        "days_remaining": cooldown_days - days_since,
    }
