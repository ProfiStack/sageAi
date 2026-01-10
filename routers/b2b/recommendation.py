from sqlalchemy.orm import Session
from models.b2b_models import B2BFaceScan, B2BUser, Product
from models.b2b_models import SkinAttribute, ProductSkinBenefit
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.b2b_schemas import ScanInput, RecommendationResponse, RecommendedProduct
from db import SessionLocal
from routers.b2b.auth import verify_b2b_bearer

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def build_user_needs(scan_data: dict) -> dict:
    needs = {}

    for concern in scan_data.get("concerns", []):
        needs[concern["value"]] = concern["confidence"]

    hydration = scan_data.get("hydration")
    if hydration:
        needs["hydration"] = hydration["confidence"]

    return needs

def get_latest_scan_data(db: Session, user_id: str):
    return (
        db.query(B2BFaceScan)
        .filter(B2BFaceScan.b2b_user_id == user_id)
        .order_by(B2BFaceScan.created_at.desc())
        .first()
    )

def build_needs_from_scan(scan: B2BFaceScan):
    needs = {}

    for value, conf in zip(scan.concerns, scan.concerns_confidence):
        needs[value] = conf

    if scan.texture:
        needs[scan.texture] = scan.texture_confidence

    if scan.skin_type:
        needs[scan.skin_type] = scan.skin_type_confidence

    return needs

def recommend_products(db: Session, needs: dict, limit=5):
    attributes = (
        db.query(SkinAttribute)
        .filter(SkinAttribute.key.in_(needs.keys()))
        .all()
    )

    attr_map = {a.id: a.key for a in attributes}

    rows = (
        db.query(Product, ProductSkinBenefit)
        .join(ProductSkinBenefit)
        .filter(ProductSkinBenefit.attribute_id.in_(attr_map.keys()))
        .all()
    )

    scores = {}

    for product, benefit in rows:
        confidence = needs[attr_map[benefit.attribute_id]]
        score = confidence * benefit.weight

        if product.id not in scores:
            scores[product.id] = {
                "product": product,
                "score": 0,
                "reasons": []
            }

        scores[product.id]["score"] += score
        scores[product.id]["reasons"].append(attr_map[benefit.attribute_id])

    return sorted(
        scores.values(),
        key=lambda x: x["score"],
        reverse=True
    )[:limit]


def recommend_products(
    db: Session,
    scan_data: dict,
    limit: int = 5
):
    needs = build_user_needs(scan_data)

    if not needs:
        return []

    attributes = (
        db.query(SkinAttribute)
        .filter(SkinAttribute.key.in_(needs.keys()))
        .all()
    )

    attribute_map = {a.id: a.key for a in attributes}

    results = (
        db.query(
            Product,
            ProductSkinBenefit.weight,
            ProductSkinBenefit.attribute_id
        )
        .join(ProductSkinBenefit)
        .filter(ProductSkinBenefit.attribute_id.in_(attribute_map.keys()))
        .all()
    )

    scores = {}

    for product, weight, attr_id in results:
        confidence = needs[attribute_map[attr_id]]
        score = weight * confidence

        if product.id not in scores:
            scores[product.id] = {
                "product": product,
                "score": 0,
                "reasons": set()
            }

        scores[product.id]["score"] += score
        scores[product.id]["reasons"].add(attribute_map[attr_id])

    sorted_products = sorted(
        scores.values(),
        key=lambda x: x["score"],
        reverse=True
    )[:limit]

    return sorted_products



router = APIRouter(prefix="/b2b/recommendations", tags=["B2B"])




@router.get("/b2b/users/{user_id}/recommendations")
def get_user_recommendations(
    user_id: str,
    client_id=Depends(verify_b2b_bearer),
    db: Session = Depends(get_db),
):
    user = (
        db.query(B2BUser)
        .filter_by(id=user_id, client_id=client_id)
        .first()
    )

    if not user:
        raise HTTPException(404, "User not found")

    scan = get_latest_scan_data(db, user.id)

    if not scan:
        raise HTTPException(400, "No scan found")

    needs = build_needs_from_scan(scan)
    results = recommend_products(db, needs)

    return {
        "user_id": user_id,
        "scan_id": scan.id,
        "recommendations": [
            {
                "product_id": str(r["product"].id),
                "brand": r["product"].brand_name,
                "name": r["product"].product_name,
                "url": r["product"].url,
                "score": round(r["score"], 2),
                "matched_on": r["reasons"]
            }
            for r in results
        ]
    }
