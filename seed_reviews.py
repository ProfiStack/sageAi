"""
Run once to seed default reviews into the database.
Usage:  uv run seed_reviews.py
        python seed_reviews.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from core.database import SessionLocal
from models.db_models import Review

SEED_REVIEWS = [
    {
        "reviewer_name": "Wafa",
        "reviewer_country": "Pakistan",
        "rating": 5,
        "title": "Finally matched my shade perfectly",
        "body": "Sage's shade matching got my deep brown skin tone right on the first try — something no app has ever done. The skin analysis also caught my T-zone oiliness and recommended exactly the right products.",
        "feature_tag": "shade_matching",
    },
    {
        "reviewer_name": "Mashal",
        "reviewer_country": "Pakistan",
        "rating": 5,
        "title": "Knows my undertone better than I do",
        "body": "I've always struggled with warm olive undertones online. Sage read them correctly and suggested shades I'd never have picked myself — every single one worked. The skin analysis flagging was spot on too.",
        "feature_tag": "shade_matching",
    },
    {
        "reviewer_name": "Aqsa",
        "reviewer_country": "Turkey",
        "rating": 5,
        "title": "Caught what my dermatologist missed",
        "body": "Sage identified early dehydration and mild inflammation from a single photo — I'd dismissed it as normal dryness for years. Six weeks on the recommended routine and my skin feels completely different.",
        "feature_tag": "skin_analysis",
    },
    {
        "reviewer_name": "Aisha",
        "reviewer_country": "Nigeria",
        "rating": 5,
        "title": "Built for deeper skin tones",
        "body": "Most skincare apps get darker complexions completely wrong. Sage accurately identified my hyperpigmentation and matched my shade precisely. First time an app has actually made sense for my skin.",
        "feature_tag": "skin_analysis",
    },
    {
        "reviewer_name": "Farah Deif",
        "reviewer_country": "Japan",
        "rating": 5,
        "title": "Texture analysis is impressively accurate",
        "body": "Sage picked up uneven texture on my nose and cheekbones that I'd been ignoring. The suggested exfoliation routine and serum combo made a visible difference within three weeks. Really impressed.",
        "feature_tag": "skin_analysis",
    },
    {
        "reviewer_name": "Aisha Mohammed",
        "reviewer_country": "United Arab Emirates",
        "rating": 5,
        "title": "Matched me on the first attempt",
        "body": "Every shade tool I've tried suggested shades that were too light or too grey for my complexion. Sage got it right immediately and also identified dehydration hiding under my oily surface. Game changer.",
        "feature_tag": "shade_matching",
    },
    {
        "reviewer_name": "Faizan",
        "reviewer_country": "Denmark",
        "rating": 5,
        "title": "Finally gentle recommendations for sensitive skin",
        "body": "Sage correctly identified my redness-prone areas and flagged irritants in my current products. The fragrance-free routine it suggested has kept my skin calm for the first time in years.",
        "feature_tag": "skin_analysis",
    },
    {
        "reviewer_name": "Sarahh",
        "reviewer_country": "Mexico",
        "rating": 5,
        "title": "Detailed analysis I didn't expect",
        "body": "I got a full breakdown of sebum levels, inflammation markers and a pigmentation map — not a generic quiz result. Two months on the routine and my acne scarring has noticeably faded.",
        "feature_tag": "skin_analysis",
    },
    {
        "reviewer_name": "Samiya",
        "reviewer_country": "France",
        "rating": 5,
        "title": "Impressed from a beauty industry perspective",
        "body": "I work in beauty and tested Sage sceptically. It correctly mapped my perioral dryness, forehead oiliness and cheek sensitivity from one photo. The shade matching for my neutral beige was equally precise.",
        "feature_tag": "skin_analysis",
    },
    {
        "reviewer_name": "Naira",
        "reviewer_country": "Italy",
        "rating": 5,
        "title": "Understood my combination skin instantly",
        "body": "Sage treated my oily zone and dry patches as separate concerns rather than averaging them out. That alone is more intelligent than anything else I've tried. The shade result for Mediterranean olive was perfect.",
        "feature_tag": "recommendation",
    },
]


def seed():
    db = SessionLocal()
    try:
        # Wipe and re-seed cleanly
        deleted = db.query(Review).filter(Review.is_seeded == True).delete()  # noqa: E712
        if deleted:
            print(f"Removed {deleted} old seeded review(s).")

        for item in SEED_REVIEWS:
            review = Review(
                reviewer_name=item["reviewer_name"],
                reviewer_country=item["reviewer_country"],
                rating=item["rating"],
                title=item.get("title"),
                body=item["body"],
                feature_tag=item.get("feature_tag"),
                is_published=True,
                is_seeded=True,
            )
            db.add(review)

        db.commit()
        print(f"Seeded {len(SEED_REVIEWS)} review(s) successfully.")
    except Exception as exc:
        db.rollback()
        print(f"Seed failed: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
