const BASE_URL = process.env.NEXT_PUBLIC_GLOBAL_BASE_URL || "http://localhost:8000";

/**
 * Fetch published reviews from the SageAI API.
 * @param {Object} params
 * @param {string} [params.feature_tag]   - Filter by tag: skin_analysis | shade_matching | general | recommendation | onboarding
 * @param {number} [params.min_rating=1]  - Minimum star rating (1–5)
 * @param {number} [params.limit=10]      - Max reviews to return
 * @param {number} [params.offset=0]      - Pagination offset
 */
export async function fetchReviews({ feature_tag, min_rating = 1, limit = 10, offset = 0 } = {}) {
  const params = new URLSearchParams();
  if (feature_tag) params.set("feature_tag", feature_tag);
  if (min_rating > 1) params.set("min_rating", min_rating);
  params.set("limit", limit);
  params.set("offset", offset);

  const res = await fetch(`${BASE_URL}/api/reviews?${params.toString()}`, {
    next: { revalidate: 60 }, // Next.js ISR — revalidate every 60s
  });

  if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);
  return res.json(); // { total, reviews, average_rating }
}
