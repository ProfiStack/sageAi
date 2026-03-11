from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import SessionLocal
from models.b2b_models import B2BFaceScan, B2BUser, Product, SkinAttribute, ProductSkinBenefit
from routers.b2b.auth import get_db, verify_b2b_bearer


router = APIRouter(tags=["B2B"])


def get_latest_scan(db: Session, user_id: str):
    return (
        db.query(B2BFaceScan)
        .filter(B2BFaceScan.b2b_user_id == user_id)
        .order_by(B2BFaceScan.created_at.desc())
        .first()
    )


def build_needs_from_scan(scan: B2BFaceScan) -> dict:
    """Build {concern_key: confidence} dict from a stored scan record."""
    needs = {}

    if scan.concerns and scan.concerns_confidence:
        for value, conf in zip(scan.concerns, scan.concerns_confidence):
            needs[value] = conf

    if scan.texture and scan.texture_confidence:
        needs[scan.texture] = scan.texture_confidence

    if scan.skin_type and scan.skin_type_confidence:
        needs[scan.skin_type] = scan.skin_type_confidence

    return needs


def recommend_products(db: Session, needs: dict, limit: int = 5) -> list:
    """Score products against user needs and return top results."""
    if not needs:
        return []

    attributes = (
        db.query(SkinAttribute)
        .filter(SkinAttribute.key.in_(needs.keys()))
        .all()
    )

    if not attributes:
        return []

    attr_map = {a.id: a.key for a in attributes}

    rows = (
        db.query(Product, ProductSkinBenefit.weight, ProductSkinBenefit.attribute_id)
        .join(ProductSkinBenefit, Product.id == ProductSkinBenefit.product_id)
        .filter(ProductSkinBenefit.attribute_id.in_(attr_map.keys()))
        .all()
    )

    scores = {}
    for product, weight, attr_id in rows:
        confidence = needs[attr_map[attr_id]]
        score = weight * confidence

        if product.id not in scores:
            scores[product.id] = {
                "product": product,
                "score": 0.0,
                "reasons": [],
            }

        scores[product.id]["score"] += score
        reason = attr_map[attr_id]
        if reason not in scores[product.id]["reasons"]:
            scores[product.id]["reasons"].append(reason)

    return sorted(scores.values(), key=lambda x: x["score"], reverse=True)[:limit]


@router.get("/users/{user_id}/recommendations")
def get_user_recommendations(
    user_id: str,
    client_id: str = Depends(verify_b2b_bearer),
    db: Session = Depends(get_db),
    limit: int = 5,
):
    user = (
        db.query(B2BUser)
        .filter_by(id=user_id, client_id=client_id)
        .first()
    )

    if not user:
        raise HTTPException(404, "User not found")

    scan = get_latest_scan(db, user.id)

    if not scan:
        raise HTTPException(400, "No scan found for this user. Please perform a scan first.")

    needs = build_needs_from_scan(scan)
    results = recommend_products(db, needs, limit=limit)

    return {
        "user_id": user_id,
        "scan_id": scan.id,
        "recommendations": [
            {
                "product_id": r["product"].id,
                "brand": r["product"].brand_name,
                "name": r["product"].product_name,
                "url": r["product"].url,
                "price_cents": r["product"].price_cents,
                "currency": r["product"].currency,
                "score": round(r["score"], 4),
                "matched_on": r["reasons"],
            }
            for r in results
        ],
    }
