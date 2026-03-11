from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.db_models import Review
from schemas.review import ReviewCreate, ReviewListResponse, ReviewResponse, ReviewUpdate


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
        is_published=True,
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
