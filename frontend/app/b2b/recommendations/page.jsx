"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Package, ExternalLink, Star, RefreshCw,
  AlertCircle, Sparkles, User, ChevronDown,
} from "lucide-react";
import { Api } from "@/shared/api/api";
import useB2BStore from "@/store/b2bStore";

export default function B2BRecommendationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F9F7] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#02331E]/30 border-t-[#02331E] animate-spin" /></div>}>
      <B2BRecommendationsPageContent />
    </Suspense>
  );
}

function B2BRecommendationsPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { apiKey, isAuthenticated } = useB2BStore();

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(params.get("userId") || "");
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/b2b");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!apiKey) return;
    Api.b2b.listUsers(apiKey).then((res) => {
      if (Array.isArray(res)) setUsers(res);
    });
  }, [apiKey]);

  const fetchRecommendations = useCallback(async (userId) => {
    if (!userId) return;
    setLoading(true);
    setError("");
    setRecommendations(null);
    try {
      const res = await Api.b2b.getRecommendations(apiKey, userId, 5);
      if (res?.recommendations) {
        setRecommendations(res);
      } else {
        setError(res?.detail || "No recommendations found. Run a scan for this user first.");
      }
    } catch {
      setError("Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    if (selectedUserId) fetchRecommendations(selectedUserId);
  }, [selectedUserId, fetchRecommendations]);

  const formatPrice = (cents, currency = "AED") => {
    if (!cents) return null;
    return `${currency} ${(cents / 100).toFixed(0)}`;
  };

  const scoreBar = (score) => {
    const pct = Math.min(100, Math.round(score * 100));
    return pct;
  };

  const tagColor = (reason) => {
    const map = {
      acne: "bg-red-50 text-red-600",
      oily_skin: "bg-blue-50 text-blue-600",
      dry_skin: "bg-amber-50 text-amber-700",
      sensitive_skin: "bg-pink-50 text-pink-600",
      hyperpigmentation: "bg-purple-50 text-purple-600",
      ageing: "bg-indigo-50 text-indigo-600",
      dehydration: "bg-sky-50 text-sky-600",
      default: "bg-[#02331E]/8 text-[#02331E]",
    };
    return map[reason] || map.default;
  };

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      {/* Header */}
      <header className="bg-[#02331E] text-white px-6 py-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push("/b2b/dashboard")}
            className="flex items-center gap-2 text-white/70 hover:text-white transition text-sm"
          >
            <ArrowLeft size={16} /> Dashboard
          </button>
          <span className="text-white/30">|</span>
          <div className="flex items-center gap-2">
            <Package size={18} className="text-[#D4B038]" />
            <span className="font-semibold">Product Recommendations</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* User selector */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#02331E]/10 flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-[#02331E]" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Select User
              </label>
              <div className="relative">
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02331E]/30 focus:border-[#02331E] text-sm bg-white appearance-none pr-8"
                >
                  <option value="">Choose a user to view recommendations...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.email || u.external_user_id}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {selectedUserId && (
              <button
                onClick={() => fetchRecommendations(selectedUserId)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#02331E] px-3 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <AnimatePresence mode="wait">
          {!selectedUserId && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <Sparkles size={40} className="text-gray-200 mb-4" />
              <p className="text-gray-400">Select a user to see their personalised product recommendations</p>
            </motion.div>
          )}

          {loading && selectedUserId && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div className="w-12 h-12 rounded-full bg-[#02331E]/10 flex items-center justify-center mb-4 animate-pulse">
                <Package size={22} className="text-[#02331E]" />
              </div>
              <p className="text-gray-500 text-sm">Loading recommendations...</p>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 py-16 text-center"
            >
              <AlertCircle size={32} className="text-gray-300" />
              <p className="text-gray-500 text-sm max-w-sm">{error}</p>
              <button
                onClick={() => router.push(`/b2b/scan?userId=${selectedUserId}`)}
                className="text-sm bg-[#02331E] text-white px-4 py-2 rounded-xl hover:bg-[#024029] transition mt-2"
              >
                Run a scan for this user
              </button>
            </motion.div>
          )}

          {recommendations && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Summary bar */}
              <div className="bg-[#02331E] text-white rounded-2xl px-5 py-4 mb-5 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-semibold">
                    {recommendations.recommendations.length} Personalised Recommendations
                  </p>
                  <p className="text-white/60 text-xs mt-0.5">
                    Based on scan · {new Date().toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/b2b/scan?userId=${selectedUserId}`)}
                  className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition border border-white/20"
                >
                  Re-scan user
                </button>
              </div>

              {/* Products grid */}
              <div className="grid gap-4">
                {recommendations.recommendations.map((rec, i) => (
                  <motion.div
                    key={rec.product_id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-4">
                      {/* Rank badge */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        i === 0 ? "bg-[#D4B038] text-[#02331E]" :
                        i === 1 ? "bg-gray-200 text-gray-600" :
                        "bg-[#02331E]/10 text-[#02331E]"
                      }`}>
                        #{i + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">{rec.brand}</p>
                            <p className="font-semibold text-[#02331E] leading-tight">{rec.name}</p>
                          </div>
                          {rec.price_cents && (
                            <span className="text-sm font-bold text-[#02331E] flex-shrink-0">
                              {formatPrice(rec.price_cents, rec.currency)}
                            </span>
                          )}
                        </div>

                        {/* Match score */}
                        <div className="mt-3 mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-400">Match score</span>
                            <span className="text-xs font-semibold text-[#02331E]">{scoreBar(rec.score)}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${scoreBar(rec.score)}%` }}
                              transition={{ delay: i * 0.07 + 0.3, duration: 0.6 }}
                              className="h-full bg-gradient-to-r from-[#02331E] to-[#3a8f5f] rounded-full"
                            />
                          </div>
                        </div>

                        {/* Matched concerns */}
                        {rec.matched_on?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {rec.matched_on.map((reason, j) => (
                              <span
                                key={j}
                                className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${tagColor(reason)}`}
                              >
                                {reason.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Link */}
                      {rec.url && (
                        <a
                          href={rec.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#02331E] hover:border-[#02331E]/30 transition"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
