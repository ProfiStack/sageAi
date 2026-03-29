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


# Map raw scanner output values → canonical skin_attribute keys in the DB.
# The analyzer sometimes returns shorthand (e.g. "dry" instead of "dry_skin").
_ALIAS: dict[str, str] = {
    # skin types
    "dry":           "dry_skin",
    "oily":          "oily_skin",
    "combination":   "combination_skin",
    "sensitive":     "sensitive_skin",
    "normal":        "normal_skin",
    # textures
    "rough":         "rough_texture",
    "uneven":        "uneven_texture",
    "smooth":        "smooth_texture",
    # concerns
    "enlarged_pores": "large_pores",
    "large pores":    "large_pores",
    "dark_circles":   "dark_circles",
    "fine_lines":     "wrinkles",
    "fine lines":     "wrinkles",
    "sun_damage":     "hyperpigmentation",
}


def _normalise(raw: str) -> str:
    """Lowercase, underscore-space, then apply alias map."""
    key = raw.strip().lower().replace(" ", "_")
    return _ALIAS.get(key, key)


def build_needs_from_scan(scan: B2BFaceScan) -> dict:
    """Build {concern_key: confidence} dict from a stored scan record.

    Confidence values default to 1.0 when not stored (the analyzer
    currently saves None for all confidence fields).
    """
    needs = {}

    if scan.concerns:
        confs = scan.concerns_confidence or []
        for i, value in enumerate(scan.concerns):
            if not value:
                continue
            key = _normalise(value)
            conf = confs[i] if i < len(confs) else 1.0
            needs[key] = conf if conf is not None else 1.0

    if scan.texture:
        key = _normalise(scan.texture)
        needs[key] = scan.texture_confidence if scan.texture_confidence is not None else 1.0

    if scan.skin_type:
        key = _normalise(scan.skin_type)
        needs[key] = scan.skin_type_confidence if scan.skin_type_confidence is not None else 1.0

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
