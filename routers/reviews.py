import os
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from sqlalchemy.orm import Session

from controllers.review_controller import (
    create_review,
    delete_review,
    get_review,
    get_review_prompt_status,
    list_reviews,
    publish_review,
    update_review,
)
from core.database import get_db
from core.security import get_current_user
from schemas.review import ReviewCreate, ReviewListResponse, ReviewResponse, ReviewUpdate

router = APIRouter(tags=["Reviews"])

# ── Auth helpers ─────────────────────────────────────────────────────────────

UserDep = Annotated[dict, Depends(get_current_user)]


def _require_admin(x_admin_secret: str = Header(...)):
    if x_admin_secret != os.getenv("ADMIN_SECRET"):
        raise HTTPException(status_code=403, detail="Invalid admin secret")


# ══════════════════════════════════════════════════════════════════════════════
#  PUBLIC
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/reviews", response_model=ReviewListResponse)
async def get_reviews(
    feature_tag: Optional[str] = Query(None, description="Filter by feature tag: skin_analysis, shade_matching, general, recommendation, onboarding"),
    min_rating: int = Query(1, ge=1, le=5, description="Minimum star rating (1–5)"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """List all published reviews. Optionally filter by feature tag or minimum rating."""
    return await list_reviews(
        db,
        feature_tag=feature_tag,
        published_only=True,
        min_rating=min_rating,
        limit=limit,
        offset=offset,
    )


@router.get("/reviews/{review_id}", response_model=ReviewResponse)
async def get_single_review(review_id: str, db: Session = Depends(get_db)):
    """Get a single review by ID."""
    return await get_review(review_id, db)


# ══════════════════════════════════════════════════════════════════════════════
#  AUTHENTICATED — any logged-in user
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/user/review-prompt")
async def review_prompt_status(
    feature_tag: str = Query(..., description="Feature to check: skin_analysis, shade_matching, etc."),
    current_user: UserDep = None,
    db: Session = Depends(get_db),
):
    """
    Returns whether the review modal should be shown for the current user + feature.
    Cooldown rules are defined server-side per feature tag.
    """
    return await get_review_prompt_status(
        user_id=current_user["user_id"],
        feature_tag=feature_tag,
        db=db,
    )


@router.post("/reviews", response_model=ReviewResponse, status_code=201)
async def submit_review(
    data: ReviewCreate,
    current_user: UserDep,
    db: Session = Depends(get_db),
):
    """Submit a new review. Requires a valid JWT token."""
    return await create_review(data, db, user_id=current_user["user_id"])


@router.put("/reviews/{review_id}", response_model=ReviewResponse)
async def edit_review(
    review_id: str,
    data: ReviewUpdate,
    current_user: UserDep,
    db: Session = Depends(get_db),
):
    """Edit your own review. Owners can only update their own reviews."""
    return await update_review(review_id, data, db, requesting_user_id=current_user["user_id"])


@router.delete("/reviews/{review_id}")
async def remove_review(
    review_id: str,
    current_user: UserDep,
    db: Session = Depends(get_db),
):
    """Delete your own review."""
    return await delete_review(review_id, db, requesting_user_id=current_user["user_id"])


# ══════════════════════════════════════════════════════════════════════════════
#  ADMIN — X-Admin-Secret header required
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/admin/reviews", response_model=ReviewListResponse, dependencies=[Depends(_require_admin)])
async def admin_list_all_reviews(
    feature_tag: Optional[str] = Query(None),
    published_only: bool = Query(False),
    min_rating: int = Query(1, ge=1, le=5),
    limit: int = Query(100, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """Admin: list all reviews including unpublished ones."""
    return await list_reviews(
        db,
        feature_tag=feature_tag,
        published_only=published_only,
        min_rating=min_rating,
        limit=limit,
        offset=offset,
    )


@router.patch("/admin/reviews/{review_id}/publish", response_model=ReviewResponse, dependencies=[Depends(_require_admin)])
async def toggle_publish(review_id: str, db: Session = Depends(get_db)):
    """Admin: toggle published/unpublished status of a review."""
    return await publish_review(review_id, db)


@router.delete("/admin/reviews/{review_id}", dependencies=[Depends(_require_admin)])
async def admin_delete_review(review_id: str, db: Session = Depends(get_db)):
    """Admin: delete any review regardless of owner."""
    return await delete_review(review_id, db, requesting_user_id=None)
