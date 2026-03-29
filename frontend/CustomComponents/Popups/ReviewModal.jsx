"use client";
import React, { useState } from "react";
import { X, Star, Send, Sparkles } from "lucide-react";
import { Api } from "@/shared/api/api";
import useAuthStore from "@/store/authStore";

const FEATURE_LABELS = {
  skin_analysis: "Skin Analysis",
  shade_matching: "Shade Matching",
  recommendation: "Recommendations",
  general: "SageAI",
  onboarding: "Onboarding",
};

const STAR_LABELS = ["", "Poor", "Fair", "Good", "Great", "Amazing!"];
const BODY_MIN_LEN = 10;

export default function ReviewModal({ featureTag = "general", onClose, onSubmitted }) {
  const { token, name } = useAuthStore();

  const [hoveredStar, setHoveredStar]   = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [reviewerName, setReviewerName] = useState(name || "");
  const [title, setTitle]               = useState("");
  const [body, setBody]                 = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [error, setError]               = useState("");

  const featureLabel = FEATURE_LABELS[featureTag] || "SageAI";
  const displayStar  = hoveredStar || selectedStar;

  const handleSubmit = async () => {
    if (!selectedStar) {
      setError("Please select a star rating.");
      return;
    }
    if (!reviewerName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (body.trim() && body.trim().length < BODY_MIN_LEN) {
      setError(`Your review must be at least ${BODY_MIN_LEN} characters.`);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        rating:        selectedStar,
        reviewer_name: reviewerName.trim(),
        feature_tag:   featureTag,
        ...(title.trim() && { title: title.trim() }),
        ...(body.trim()  && { body:  body.trim()  }),
      };

      await Api.client.submitReview(token, payload);
      setSubmitted(true);

      setTimeout(() => {
        onSubmitted?.();
        onClose?.();
      }, 1800);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#02331E] to-[#02331E]/90 px-6 pt-6 pb-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#D4B038]" />
            <p className="text-[#D4B038] text-sm font-medium">Quick Review</p>
          </div>
          <h2 className="text-white text-xl font-bold leading-snug">
            How was your {featureLabel} experience?
          </h2>
          <p className="text-white/60 text-xs mt-1">
            Your feedback helps us improve SageAI for everyone.
          </p>
        </div>

        {submitted ? (
          /* ── Success state ── */
          <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 bg-[#02331E]/10 rounded-full flex items-center justify-center mb-2">
              <Star className="w-8 h-8 text-[#D4B038] fill-[#D4B038]" />
            </div>
            <h3 className="text-[#02331E] text-lg font-bold">Thank you!</h3>
            <p className="text-[#02331E]/60 text-sm">Your review means a lot to us. 💚</p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">

            {/* Stars */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setSelectedStar(star)}
                    className="transition-transform active:scale-90"
                  >
                    <Star
                      className={`w-9 h-9 transition-all duration-150 ${
                        star <= displayStar
                          ? "text-[#D4B038] fill-[#D4B038] scale-110"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {displayStar > 0 && (
                <p className="text-[#D4B038] font-semibold text-sm">
                  {STAR_LABELS[displayStar]}
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-[#02331E]/70 uppercase tracking-wide mb-1 block">
                Your Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Sarah K."
                className="w-full border border-[#02331E]/20 rounded-xl px-4 py-2.5 text-sm text-[#02331E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#02331E]/30"
              />
            </div>

            {/* Optional Title */}
            <div>
              <label className="text-xs font-semibold text-[#02331E]/70 uppercase tracking-wide mb-1 block">
                Title <span className="text-[#02331E]/40">(optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Game-changer for my skin!"
                className="w-full border border-[#02331E]/20 rounded-xl px-4 py-2.5 text-sm text-[#02331E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#02331E]/30"
              />
            </div>

            {/* Optional Body */}
            <div>
              <label className="text-xs font-semibold text-[#02331E]/70 uppercase tracking-wide mb-1 block">
                Tell us more{" "}
                <span className="text-[#02331E]/40">
                  (optional · min {BODY_MIN_LEN} chars if filled)
                </span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What did you love? Any suggestions?"
                rows={3}
                className="w-full border border-[#02331E]/20 rounded-xl px-4 py-2.5 text-sm text-[#02331E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#02331E]/30 resize-none"
              />
              {body.trim().length > 0 && body.trim().length < BODY_MIN_LEN && (
                <p className="text-amber-500 text-xs mt-1">
                  {BODY_MIN_LEN - body.trim().length} more character{BODY_MIN_LEN - body.trim().length !== 1 ? "s" : ""} needed
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pb-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#02331E]/20 text-[#02331E]/60 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#02331E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#02331E]/90 active:scale-95 transition-all disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Submitting…</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  );
}
