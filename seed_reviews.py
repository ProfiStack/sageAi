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
        "reviewer_name": "Amara Osei",
        "reviewer_country": "Ghana",
        "rating": 5,
        "title": "Finally found my perfect shade",
        "body": (
            "I have been struggling for years to find foundation that actually matches my deep brown skin. "
            "Sage's shade matching feature scanned my skin and gave me three options that were genuinely accurate. "
            "I ordered one and it blended perfectly on the first try. The skin analysis also flagged my T-zone "
            "oiliness and recommended a lightweight moisturiser I had never considered. Completely changed my routine."
        ),
        "feature_tag": "shade_matching",
    },
    {
        "reviewer_name": "Elif Yilmaz",
        "reviewer_country": "Turkey",
        "rating": 5,
        "title": "Skin analysis caught what my dermatologist missed",
        "body": (
            "I uploaded a photo of my cheek area and within seconds Sage identified early signs of dehydration "
            "and mild inflammation that I had dismissed as normal dryness. The ingredient recommendations were "
            "tailored to my skin tone and concerns. I have been following the routine for six weeks and the "
            "difference is visible. My skin feels balanced in a way it never has before."
        ),
        "feature_tag": "skin_analysis",
    },
    {
        "reviewer_name": "Priya Nair",
        "reviewer_country": "India",
        "rating": 5,
        "title": "The shade matching is shockingly accurate",
        "body": (
            "As someone with warm olive undertones, finding the right foundation shade online is always a gamble. "
            "Sage read my undertone correctly and recommended shades I would never have picked myself from a "
            "swatch chart. The skin analysis picked up pigmentation around my jawline and suggested products "
            "with niacinamide which have genuinely helped even out my complexion over time."
        ),
        "feature_tag": "shade_matching",
    },
    {
        "reviewer_name": "Sofia Andersen",
        "reviewer_country": "Denmark",
        "rating": 4,
        "title": "Impressed by the level of personalisation",
        "body": (
            "I was sceptical that an AI could accurately assess my fair, sensitive Scandinavian skin, but Sage "
            "surprised me. It detected my redness-prone areas correctly and flagged that some of the ingredients "
            "in my current products were likely contributing to irritation. The recommendations were gentle and "
            "fragrance-free which is exactly what I needed. Taking off one star only because I wish there were "
            "more budget-friendly product options in the results."
        ),
        "feature_tag": "skin_analysis",
    },
    {
        "reviewer_name": "James Okafor",
        "reviewer_country": "Nigeria",
        "rating": 5,
        "title": "Built for skin like mine",
        "body": (
            "Most skincare apps are clearly designed with lighter skin tones in mind and the analysis is "
            "completely off for darker complexions. Sage is different. The skin analysis accurately identified "
            "hyperpigmentation from old acne spots and the shade matching gave me a precise match for my very "
            "deep ebony tone. For the first time an app gave me recommendations that actually made sense for me. "
            "I have already recommended it to my brothers and cousins."
        ),
        "feature_tag": "skin_analysis",
    },
    {
        "reviewer_name": "Yuki Tanaka",
        "reviewer_country": "Japan",
        "rating": 5,
        "title": "Detected my skin texture concerns accurately",
        "body": (
            "I have very fine pores and subtle uneven texture that most products ignore. Sage's scan picked up "
            "the texture irregularities on my nose bridge and cheekbones and suggested a targeted exfoliation "
            "routine alongside a lightweight serum. The shade analysis also correctly identified my cool pink "
            "undertone which is something I always get wrong when shopping alone. Very impressed."
        ),
        "feature_tag": "shade_matching",
    },
    {
        "reviewer_name": "Isabella Rossi",
        "reviewer_country": "Italy",
        "rating": 4,
        "title": "Great analysis, wish there were more European brands",
        "body": (
            "The skin analysis is genuinely one of the most detailed I have encountered. It identified my "
            "combination skin pattern accurately and the recommendation logic clearly understood that my oily "
            "zone and dry patches need different treatment. The shade matching was also very precise for my "
            "Mediterranean olive skin. My only feedback is that I would love to see more Italian and French "
            "skincare brands in the recommendation catalogue."
        ),
        "feature_tag": "recommendation",
    },
    {
        "reviewer_name": "Carlos Mendez",
        "reviewer_country": "Mexico",
        "rating": 5,
        "title": "Sage understood my skin better than I did",
        "body": (
            "I signed up expecting a basic quiz and generic advice but what I got was a detailed breakdown of "
            "my skin's sebum levels, inflammation markers, and pigmentation map. The shade matching for my warm "
            "golden brown skin tone was spot on and the three suggested foundations were all available to order "
            "locally. I have been using the recommended routine for two months and my acne scarring has faded "
            "noticeably. Genuinely transformative experience."
        ),
        "feature_tag": "skin_analysis",
    },
    {
        "reviewer_name": "Aisha Mohammed",
        "reviewer_country": "United Arab Emirates",
        "rating": 5,
        "title": "Finally an app that respects deeper skin tones",
        "body": (
            "I have tried many shade matching tools and they always suggest shades that are too light or too "
            "grey for my deep warm brown complexion. Sage matched me perfectly on the first attempt and also "
            "gave me a full skin analysis that identified dehydration despite my skin looking oily on the "
            "surface. The layered routine it suggested has made such a difference. I now recommend Sage to "
            "everyone in my family."
        ),
        "feature_tag": "shade_matching",
    },
    {
        "reviewer_name": "Chloe Bernard",
        "reviewer_country": "France",
        "rating": 5,
        "title": "The most thorough skin assessment I have ever had",
        "body": (
            "As someone who works in the beauty industry I was curious to test Sage against my professional "
            "knowledge. I was genuinely impressed. The skin analysis correctly identified my perioral dryness, "
            "my forehead's excess sebum production, and my cheek sensitivity all from a single photo. The "
            "shade matching was equally precise for my neutral beige undertone. This is the kind of tool that "
            "will genuinely democratise access to personalised skincare advice."
        ),
        "feature_tag": "skin_analysis",
    },
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(Review).filter(Review.is_seeded == True).count()  # noqa: E712
        if existing >= len(SEED_REVIEWS):
            print(f"Seed reviews already present ({existing} rows). Skipping.")
            return

        added = 0
        for item in SEED_REVIEWS:
            already = (
                db.query(Review)
                .filter(
                    Review.reviewer_name == item["reviewer_name"],
                    Review.reviewer_country == item["reviewer_country"],
                    Review.is_seeded == True,  # noqa: E712
                )
                .first()
            )
            if already:
                continue
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
            added += 1

        db.commit()
        print(f"Seeded {added} review(s) successfully.")
    except Exception as exc:
        db.rollback()
        print(f"Seed failed: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
