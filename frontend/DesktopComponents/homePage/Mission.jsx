"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { MobileMockup } from "./MobileMockup";
import { fetchReviews } from "@/services/reviews";

// ── Fallback shown if API is unreachable ─────────────────────────────────────
const FALLBACK_TESTIMONIALS = [
  {
    id: "f1",
    body: "Sage got my shade right on the first try — something no other app has managed. The skin analysis was just as accurate.",
    reviewer_name: "Amara O.",
    reviewer_country: "Ghana",
    rating: 5,
    feature_tag: "shade_matching",
  },
  {
    id: "f2",
    body: "It identified dehydration hiding under my oily surface. Six weeks on the recommended routine and my skin feels completely different.",
    reviewer_name: "Elif Y.",
    reviewer_country: "Turkey",
    rating: 5,
    feature_tag: "skin_analysis",
  },
  {
    id: "f3",
    body: "Most apps get darker complexions wrong. Sage nailed my shade and hyperpigmentation analysis instantly.",
    reviewer_name: "James O.",
    reviewer_country: "Nigeria",
    rating: 5,
    feature_tag: "skin_analysis",
  },
  {
    id: "f4",
    body: "Sage treated my oily zone and dry patches as separate concerns. That alone is more intelligent than anything else I've tried.",
    reviewer_name: "Isabella R.",
    reviewer_country: "Italy",
    rating: 5,
    feature_tag: "recommendation",
  },
  {
    id: "f5",
    body: "Correctly mapped my perioral dryness, forehead oiliness and cheek sensitivity from one photo. Genuinely impressive.",
    reviewer_name: "Chloe B.",
    reviewer_country: "France",
    rating: 5,
    feature_tag: "skin_analysis",
  },
];

const FEATURE_TAG_LABEL = {
  skin_analysis: "Skin Analysis",
  shade_matching: "Shade Matching",
  recommendation: "Recommendation",
  onboarding: "Onboarding",
  general: "General",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={
            star <= rating
              ? "fill-[#D4B038] text-[#D4B038]"
              : "text-gray-300 fill-gray-200"
          }
        />
      ))}
    </div>
  );
}

function TestimonialSkeleton() {
  return (
    <div className="bg-[#F5F5F5] rounded-2xl p-8 shadow-lg border border-[#02331E]/5 animate-pulse">
      <div className="w-8 h-8 bg-gray-200 rounded mb-4" />
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-3 h-3 bg-gray-200 rounded-full" />
        ))}
      </div>
      <div className="space-y-2 mb-5">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-28 mb-1.5" />
      <div className="h-3 bg-gray-200 rounded w-20" />
    </div>
  );
}

function TestimonialCard({ review, index, isVisible }) {
  return (
    <motion.div
      key={review.id}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
      className="relative"
      style={{
        transform: isVisible
          ? `translateY(${index * 10}px)`
          : "translateY(30px)",
      }}
    >
      <div className="bg-[#F5F5F5] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#02331E]/5 h-full flex flex-col">
        <Quote className="text-[#D4B038] mb-3 flex-shrink-0" size={28} />

        {/* Star rating */}
        <StarRating rating={review.rating} />

        {/* Feature tag badge */}
        {review.feature_tag && FEATURE_TAG_LABEL[review.feature_tag] && (
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-[#02331E] bg-[#02331E]/8 border border-[#02331E]/15 rounded-full px-2.5 py-0.5 mb-3 w-fit">
            {FEATURE_TAG_LABEL[review.feature_tag]}
          </span>
        )}

        {/* Review body */}
        <p className="text-[#121212] mb-5 leading-relaxed italic flex-1">
          &ldquo;{review.body}&rdquo;
        </p>

        {/* Reviewer info */}
        <div className="border-t border-[#02331E]/8 pt-4">
          <p className="text-[#02331E] font-semibold text-sm">
            — {review.reviewer_name}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function MissionSection() {
  const [scrollY, setScrollY]       = useState(0);
  const sectionRef                  = useRef(null);
  const [isVisible, setIsVisible]   = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [averageRating, setAverageRating] = useState(null);

  // Scroll / visibility tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setIsVisible(rect.top < window.innerHeight * 0.75 && rect.bottom > 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch reviews from API
  useEffect(() => {
    let cancelled = false;
    async function loadReviews() {
      try {
        const data = await fetchReviews({ limit: 5, min_rating: 4 });
        if (cancelled) return;
        if (data.reviews && data.reviews.length > 0) {
          setTestimonials(data.reviews);
          setAverageRating(data.average_rating);
        } else {
          setTestimonials(FALLBACK_TESTIMONIALS);
        }
      } catch {
        if (!cancelled) setTestimonials(FALLBACK_TESTIMONIALS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadReviews();
    return () => { cancelled = true; };
  }, []);

  return (
    <section
      id="mission"
      ref={sectionRef}
      className="relative py-32 bg-white overflow-hidden"
    >
      {/* Background decorative elements with parallax */}
      <div
        className="absolute top-20 left-10 w-72 h-72 bg-[#D4B038] rounded-full mix-blend-multiply opacity-5 blur-3xl"
        style={{
          transform: `translate(${(scrollY - 3200) * 0.05}px, ${(scrollY - 3200) * 0.1}px)`,
        }}
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-[#02331E] rounded-full mix-blend-multiply opacity-5 blur-3xl"
        style={{
          transform: `translate(${(scrollY - 3200) * -0.05}px, ${(scrollY - 3200) * 0.08}px)`,
        }}
      />

      {/* Parallax Mobile Mockup */}
      <div
        className="absolute top-1/2 -translate-y-1/2 right-0 opacity-40 transition-all duration-300"
        style={{
          transform: `translateY(${(scrollY - 3000) * 0.18}px) rotate(${15 + (scrollY - 3000) * 0.01}deg) scale(${1 + (scrollY - 3000) * 0.00008})`,
          filter: `blur(${Math.max(0, (scrollY - 3200) * 0.003)}px)`,
          willChange: "transform, filter",
        }}
      >
        <MobileMockup variant="chat" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl text-[#02331E] mb-8">
            Our Mission &amp; Impact
          </h2>
          <p className="text-2xl md:text-3xl text-[#121212] max-w-4xl mx-auto leading-relaxed opacity-85">
            Cutting waste, reducing returns, making expert advice accessible
            worldwide.
          </p>
        </motion.div>

        {/* Mission Statement Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="bg-gradient-to-br from-[#02331E] to-[#024029] rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4B038] rounded-full blur-3xl opacity-10" />
            <div className="relative z-10">
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
                We believe everyone deserves access to personalized,
                science-backed beauty and wellness guidance. No more confusion,
                no more waste, no more fake products. Just honest, expert advice
                that empowers you to make informed decisions about your health
                and beauty.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-1 w-20 bg-[#D4B038]" />
                <p className="text-[#D4B038]">
                  Join us in revolutionizing personal care.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials heading row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-between mb-8"
        >
          <h3 className="text-xl font-semibold text-[#02331E]">
            What our users say
          </h3>
          {averageRating && (
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star
                    key={s}
                    size={13}
                    className={s <= Math.round(averageRating) ? "fill-[#D4B038] text-[#D4B038]" : "text-gray-300 fill-gray-200"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {averageRating.toFixed(1)} avg rating
              </span>
            </div>
          )}
        </motion.div>

        {/* Testimonial cards grid — row 1: 2 cards, row 2: 3 cards */}
        {loading ? (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[0, 1].map((i) => <TestimonialSkeleton key={i} />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[2, 3, 4].map((i) => <TestimonialSkeleton key={i} />)}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.slice(0, 2).map((review, index) => (
                <TestimonialCard
                  key={review.id}
                  review={review}
                  index={index}
                  isVisible={isVisible}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.slice(2, 5).map((review, index) => (
                <TestimonialCard
                  key={review.id}
                  review={review}
                  index={index + 2}
                  isVisible={isVisible}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
