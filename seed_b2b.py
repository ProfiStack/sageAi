"""
Seed one B2B test client + products + skin attributes.
Run: uv run seed_b2b.py
"""
import uuid
import hashlib
import secrets
from datetime import datetime

from core.database import SessionLocal
from models.b2b_models import (
    B2BApiKey,
    B2BClient,
    Product,
    ProductSkinBenefit,
    SkinAttribute,
)

API_KEY_LABEL = "test-key"
CLIENT_EMAIL = "demo@glossbeauty.com"

# ─── Products ────────────────────────────────────────────────────────────────
PRODUCTS = [
    {
        "brand_name": "La Roche-Posay",
        "product_name": "Toleriane Hydrating Gentle Cleanser",
        "url": "https://www.laroche-posay.com/toleriane-hydrating-gentle-cleanser",
        "price_cents": 4500,
        "currency": "AED",
        "size": "400ml",
        "description": "Gentle foaming cleanser for dry and sensitive skin. Restores the skin barrier with prebiotic thermal water.",
        "attributes": ["dry_skin", "sensitive_skin", "dehydration"],
    },
    {
        "brand_name": "Cetaphil",
        "product_name": "Moisturising Lotion",
        "url": "https://www.cetaphil.com/moisturising-lotion",
        "price_cents": 3200,
        "currency": "AED",
        "size": "250ml",
        "description": "Lightweight daily moisturiser for sensitive skin. Non-greasy formula with niacinamide.",
        "attributes": ["dry_skin", "sensitive_skin", "rough_texture"],
    },
    {
        "brand_name": "The Ordinary",
        "product_name": "Niacinamide 10% + Zinc 1%",
        "url": "https://theordinary.com/niacinamide-10pct-zinc-1pct",
        "price_cents": 1800,
        "currency": "AED",
        "size": "30ml",
        "description": "High-strength vitamin and mineral blemish formula. Reduces the appearance of blemishes and congestion.",
        "attributes": ["oily_skin", "acne", "large_pores", "uneven_texture"],
    },
    {
        "brand_name": "Paula's Choice",
        "product_name": "Skin Perfecting 2% BHA Liquid Exfoliant",
        "url": "https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid",
        "price_cents": 11000,
        "currency": "AED",
        "size": "118ml",
        "description": "Exfoliates inside pores and on skin's surface to unclog pores and smooth skin.",
        "attributes": ["oily_skin", "acne", "blackheads", "rough_texture", "large_pores"],
    },
    {
        "brand_name": "Skinceuticals",
        "product_name": "C E Ferulic Vitamin C Serum",
        "url": "https://www.skinceuticals.com/c-e-ferulic",
        "price_cents": 38000,
        "currency": "AED",
        "size": "30ml",
        "description": "Antioxidant vitamin C serum that neutralises free radicals and improves signs of ageing.",
        "attributes": ["hyperpigmentation", "uneven_tone", "ageing", "dullness"],
    },
    {
        "brand_name": "Neutrogena",
        "product_name": "Hydro Boost Water Gel",
        "url": "https://www.neutrogena.com/hydro-boost-water-gel",
        "price_cents": 5500,
        "currency": "AED",
        "size": "50ml",
        "description": "Oil-free gel moisturiser with hyaluronic acid. Instantly quenches dry skin and keeps it hydrated.",
        "attributes": ["dehydration", "dry_skin", "oily_skin"],
    },
    {
        "brand_name": "Dermalogica",
        "product_name": "Invisible Physical Defense SPF30",
        "url": "https://www.dermalogica.com/invisible-physical-defense-spf30",
        "price_cents": 14000,
        "currency": "AED",
        "size": "50ml",
        "description": "Mineral sunscreen with zinc oxide. Provides broad-spectrum protection against UVA/UVB.",
        "attributes": ["sensitive_skin", "hyperpigmentation", "ageing"],
    },
    {
        "brand_name": "Murad",
        "product_name": "Retinol Youth Renewal Serum",
        "url": "https://www.murad.com/retinol-youth-renewal-serum",
        "price_cents": 24500,
        "currency": "AED",
        "size": "30ml",
        "description": "Triple retinol blend that accelerates skin renewal. Visibly reduces fine lines and wrinkles.",
        "attributes": ["ageing", "wrinkles", "uneven_texture", "dullness"],
    },
    {
        "brand_name": "The INKEY List",
        "product_name": "Tranexamic Acid Dark Spot Treatment",
        "url": "https://www.theinkeylist.com/tranexamic-acid",
        "price_cents": 2900,
        "currency": "AED",
        "size": "30ml",
        "description": "Targets dark spots and uneven tone. Suitable for all skin types.",
        "attributes": ["hyperpigmentation", "dark_spots", "uneven_tone"],
    },
    {
        "brand_name": "Eucerin",
        "product_name": "UltraSENSITIVE Cleansing Lotion",
        "url": "https://www.eucerin.com/ultrasensitive-cleansing-lotion",
        "price_cents": 3800,
        "currency": "AED",
        "size": "200ml",
        "description": "Gentle cleansing lotion for very sensitive and reactive skin. Fragrance-free formula.",
        "attributes": ["sensitive_skin", "redness", "inflammation"],
    },
    {
        "brand_name": "CeraVe",
        "product_name": "AM Facial Moisturising Lotion SPF25",
        "url": "https://www.cerave.com/moisturizers/am-facial-moisturizing-lotion-spf25",
        "price_cents": 4200,
        "currency": "AED",
        "size": "52ml",
        "description": "Daily face moisturiser with SPF and ceramides. Non-comedogenic and fragrance free.",
        "attributes": ["dry_skin", "ageing", "dehydration", "sensitive_skin"],
    },
    {
        "brand_name": "Kiehl's",
        "product_name": "Ultra Facial Cream",
        "url": "https://www.kiehls.com/ultra-facial-cream",
        "price_cents": 9500,
        "currency": "AED",
        "size": "50ml",
        "description": "24-hour intensely hydrating facial cream. Contains squalane and glacial glycoprotein.",
        "attributes": ["dry_skin", "dehydration", "rough_texture"],
    },
]

# All unique skin attribute keys
ALL_ATTRIBUTES = sorted({a for p in PRODUCTS for a in p["attributes"]})


def seed():
    db = SessionLocal()
    try:
        # ── 1. Client ────────────────────────────────────────────────────────
        existing = db.query(B2BClient).filter_by(email=CLIENT_EMAIL).first()
        if existing:
            print(f"[skip] Client already exists: {existing.id}")
            client = existing
        else:
            client = B2BClient(
                id=str(uuid.uuid4()),
                name="Gloss Beauty Co.",
                email=CLIENT_EMAIL,
                status="active",
                created_at=datetime.utcnow(),
            )
            db.add(client)
            db.flush()
            print(f"[ok]   Created client: {client.id}  ({client.name})")

        # ── 2. API Key ───────────────────────────────────────────────────────
        existing_key = (
            db.query(B2BApiKey)
            .filter_by(client_id=client.id, label=API_KEY_LABEL)
            .first()
        )
        raw_key = None
        if existing_key:
            print(f"[skip] API key already exists for label '{API_KEY_LABEL}'")
            print("       (raw key not stored — create a new one if needed)")
        else:
            raw_key = secrets.token_urlsafe(32)
            hashed = hashlib.sha256(raw_key.encode()).hexdigest()
            key_record = B2BApiKey(
                id=str(uuid.uuid4()),
                client_id=client.id,
                label=API_KEY_LABEL,
                api_key_hash=hashed,
                is_active=True,
                created_at=datetime.utcnow(),
            )
            db.add(key_record)
            db.flush()
            print(f"[ok]   Created API key (id={key_record.id})")

        # ── 3. Skin Attributes ───────────────────────────────────────────────
        attr_map = {}
        for key in ALL_ATTRIBUTES:
            existing_attr = db.query(SkinAttribute).filter_by(key=key).first()
            if existing_attr:
                attr_map[key] = existing_attr.id
            else:
                attr = SkinAttribute(id=str(uuid.uuid4()), key=key)
                db.add(attr)
                db.flush()
                attr_map[key] = attr.id
                print(f"[ok]   Skin attribute: {key}")

        # ── 4. Products + benefits ───────────────────────────────────────────
        for p in PRODUCTS:
            existing_prod = db.query(Product).filter_by(url=p["url"]).first()
            if existing_prod:
                print(f"[skip] Product exists: {p['product_name']}")
                prod_id = existing_prod.id
            else:
                prod = Product(
                    id=str(uuid.uuid4()),
                    brand_name=p["brand_name"],
                    product_name=p["product_name"],
                    url=p["url"],
                    price_cents=p["price_cents"],
                    currency=p["currency"],
                    size=p.get("size"),
                    description=p.get("description"),
                    created_at=datetime.utcnow(),
                )
                db.add(prod)
                db.flush()
                prod_id = prod.id
                print(f"[ok]   Product: {p['brand_name']} — {p['product_name']}")

            for attr_key in p["attributes"]:
                attr_id = attr_map[attr_key]
                existing_benefit = (
                    db.query(ProductSkinBenefit)
                    .filter_by(product_id=prod_id, attribute_id=attr_id)
                    .first()
                )
                if not existing_benefit:
                    db.add(ProductSkinBenefit(
                        product_id=prod_id,
                        attribute_id=attr_id,
                        weight=1.0,
                    ))

        db.commit()

        print("\n" + "=" * 56)
        print("  B2B Seed complete")
        print("=" * 56)
        print(f"  Client ID : {client.id}")
        print(f"  Client    : {client.name}")
        print(f"  Email     : {client.email}")
        if raw_key:
            print(f"\n  API KEY (save this — shown once):")
            print(f"  {raw_key}")
        print("=" * 56)

    finally:
        db.close()


if __name__ == "__main__":
    seed()
