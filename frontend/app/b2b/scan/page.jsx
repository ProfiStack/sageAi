"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ScanFace, ArrowLeft, CheckCircle2, AlertCircle,
  Camera, X, Sparkles, Sun, Moon, ThumbsUp, ThumbsDown,
  Leaf, Activity, Package, ExternalLink, RefreshCw,
} from "lucide-react";
import { Api } from "@/shared/api/api";
import useB2BStore from "@/store/b2bStore";

// ─── helpers ────────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
  </svg>
);

const SectionCard = ({ icon, title, color = "green", children }) => (
  <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${color === "gold" ? "border-[#D4B038]/20" : "border-gray-100"}`}>
    <div className={`px-5 py-3 flex items-center gap-2 border-b ${color === "gold" ? "bg-[#D4B038]/8 border-[#D4B038]/15" : "bg-[#02331E]/5 border-gray-100"}`}>
      <span className={color === "gold" ? "text-[#b8860b]" : "text-[#02331E]"}>{icon}</span>
      <h3 className={`font-semibold text-sm ${color === "gold" ? "text-[#b8860b]" : "text-[#02331E]"}`}>{title}</h3>
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

const StepList = ({ steps }) => (
  <ol className="space-y-2.5">
    {steps.map((step, i) => (
      <li key={i} className="flex items-start gap-3">
        <span className="w-5 h-5 rounded-full bg-[#02331E] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
          {i + 1}
        </span>
        <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
      </li>
    ))}
  </ol>
);

const tagColor = (r) => {
  const m = { acne: "bg-red-50 text-red-600", oily_skin: "bg-blue-50 text-blue-600", dry_skin: "bg-amber-50 text-amber-700", sensitive_skin: "bg-pink-50 text-pink-600", hyperpigmentation: "bg-purple-50 text-purple-600", ageing: "bg-indigo-50 text-indigo-600", dehydration: "bg-sky-50 text-sky-600" };
  return m[r] || "bg-[#02331E]/8 text-[#02331E]";
};

// ─── Page ────────────────────────────────────────────────────────────────────
export default function B2BScanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F9F7] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#02331E]/30 border-t-[#02331E] animate-spin" /></div>}>
      <B2BScanPageContent />
    </Suspense>
  );
}

function B2BScanPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { apiKey, isAuthenticated } = useB2BStore();

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(params.get("userId") || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [recs, setRecs] = useState(null);
  const [recsLoading, setRecsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/b2b");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!apiKey) return;
    Api.b2b.listUsers(apiKey).then((res) => {
      if (Array.isArray(res)) setUsers(res);
    });
  }, [apiKey]);

  const handleImage = (file) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
    setRecs(null);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleImage(file);
  };

  const fetchRecs = async (userId) => {
    setRecsLoading(true);
    try {
      const res = await Api.b2b.getRecommendations(apiKey, userId, 5);
      if (res?.recommendations) setRecs(res.recommendations);
    } catch {}
    finally { setRecsLoading(false); }
  };

  const handleScan = async () => {
    if (!selectedUserId || !imageFile) return;
    setScanning(true);
    setError("");
    setResult(null);
    setRecs(null);
    try {
      const res = await Api.b2b.scanUser(apiKey, selectedUserId, imageFile);
      if (res?.scan_id) {
        setResult(res);
        // fetch DB recommendations in parallel
        fetchRecs(selectedUserId);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      } else {
        setError(res?.detail || "Scan failed. Please try again.");
      }
    } catch {
      setError("Failed to complete the scan.");
    } finally {
      setScanning(false);
    }
  };

  const r = result?.results || {};

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      {/* Header */}
      <header className="bg-[#02331E] text-white px-6 py-4 shadow-lg sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={() => router.push("/b2b/dashboard")} className="flex items-center gap-2 text-white/70 hover:text-white transition text-sm">
            <ArrowLeft size={16} /> Dashboard
          </button>
          <span className="text-white/30">|</span>
          <div className="flex items-center gap-2">
            <ScanFace size={18} className="text-[#D4B038]" />
            <span className="font-semibold">Skin Analysis Scan</span>
          </div>
          {result && (
            <span className="ml-auto flex items-center gap-1.5 text-xs bg-[#D4B038]/20 text-[#D4B038] px-3 py-1 rounded-full border border-[#D4B038]/30">
              <CheckCircle2 size={12} /> Scan complete
            </span>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ── Setup Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Step 1 — user */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-[#02331E] text-white text-xs font-bold flex items-center justify-center">1</span>
                <span className="font-semibold text-[#02331E] text-sm">Select User</span>
              </div>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02331E]/30 focus:border-[#02331E] text-sm bg-white"
              >
                <option value="">Choose an end user...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.email || u.external_user_id}</option>
                ))}
              </select>
              {users.length === 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  No users yet.{" "}
                  <button onClick={() => router.push("/b2b/dashboard")} className="text-[#02331E] underline">Create one first</button>
                </p>
              )}
            </div>

            {/* Step 2 — image */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-[#02331E] text-white text-xs font-bold flex items-center justify-center">2</span>
                <span className="font-semibold text-[#02331E] text-sm">Upload Skin Image</span>
              </div>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => !imagePreview && fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl transition cursor-pointer ${imagePreview ? "border-[#02331E]/30" : "border-gray-200 hover:border-[#02331E]/40 hover:bg-[#02331E]/3"}`}
              >
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files[0])} />
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-36 object-cover rounded-xl" />
                    <button onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); setResult(null); setRecs(null); }} className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition">
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle2 size={11} /> Ready
                    </div>
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center gap-2 text-gray-400">
                    <Camera size={24} className="text-gray-300" />
                    <p className="text-sm font-medium text-gray-500">Drop image or click to browse</p>
                    <p className="text-xs">JPG, PNG, WebP</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scan button + error */}
          <div className="mt-5 flex flex-col gap-3">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                <AlertCircle size={15} /> {error}
              </div>
            )}
            <button
              onClick={handleScan}
              disabled={!selectedUserId || !imageFile || scanning}
              className="flex items-center justify-center gap-2 bg-[#02331E] hover:bg-[#024029] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-8 rounded-xl transition-all w-full lg:w-auto lg:min-w-[220px]"
            >
              {scanning ? <><Spinner /> Analysing skin...</> : <><ScanFace size={18} /> Run Skin Analysis</>}
            </button>
          </div>
        </div>

        {/* ── Scanning overlay ── */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-[#02331E]/10 flex items-center justify-center animate-pulse">
                <ScanFace size={28} className="text-[#02331E]" />
              </div>
              <p className="text-[#02331E] font-semibold">Analysing skin features...</p>
              <p className="text-gray-400 text-sm">This usually takes 5–15 seconds</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <AnimatePresence>
          {result && !scanning && (
            <motion.div
              ref={resultsRef}
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Banner */}
              <div className="bg-[#02331E] text-white rounded-2xl px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={22} className="text-[#D4B038]" />
                  <div>
                    <p className="font-semibold">Analysis Complete</p>
                    <p className="text-white/50 text-xs mt-0.5">Scan ID: {result.scan_id}</p>
                  </div>
                </div>
                <button
                  onClick={handleScan}
                  className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg transition"
                >
                  <RefreshCw size={12} /> Re-scan
                </button>
              </div>

              {/* Profile + Advice */}
              <div className="grid lg:grid-cols-2 gap-5">
                {r.user_profile_section && (
                  <SectionCard icon={<Sparkles size={15} />} title="Skin Profile">
                    <p className="text-sm text-gray-700 leading-relaxed">{r.user_profile_section}</p>
                  </SectionCard>
                )}
                {r.advice_section && (
                  <SectionCard icon={<Activity size={15} />} title="Expert Advice" color="gold">
                    <p className="text-sm text-gray-700 leading-relaxed">{r.advice_section}</p>
                  </SectionCard>
                )}
              </div>

              {/* Day + Night routines */}
              {(r.day_routine_section?.length > 0 || r.night_routine_section?.length > 0) && (
                <div className="grid lg:grid-cols-2 gap-5">
                  {r.day_routine_section?.length > 0 && (
                    <SectionCard icon={<Sun size={15} />} title="Day Routine">
                      <StepList steps={r.day_routine_section} />
                    </SectionCard>
                  )}
                  {r.night_routine_section?.length > 0 && (
                    <SectionCard icon={<Moon size={15} />} title="Night Routine" color="gold">
                      <StepList steps={r.night_routine_section} />
                    </SectionCard>
                  )}
                </div>
              )}

              {/* Dos & Don'ts + Lifestyle */}
              <div className="grid lg:grid-cols-2 gap-5">
                {r.dos_donts_section && (
                  <SectionCard icon={<ThumbsUp size={15} />} title="Do's & Don'ts">
                    <div className="space-y-3">
                      {r.dos_donts_section.dos?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">Do</p>
                          <ul className="space-y-1.5">
                            {r.dos_donts_section.dos.map((d, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <ThumbsUp size={13} className="text-green-500 mt-0.5 flex-shrink-0" />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {r.dos_donts_section.donts?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-red-500 mb-2 uppercase tracking-wide">Don't</p>
                          <ul className="space-y-1.5">
                            {r.dos_donts_section.donts.map((d, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <ThumbsDown size={13} className="text-red-400 mt-0.5 flex-shrink-0" />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </SectionCard>
                )}

                {r.lifestyle_adjustments_section?.length > 0 && (
                  <SectionCard icon={<Leaf size={15} />} title="Lifestyle Adjustments" color="gold">
                    <ul className="space-y-2">
                      {r.lifestyle_adjustments_section.map((l, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4B038] mt-2 flex-shrink-0" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                )}
              </div>

              {/* Seasonal switches */}
              {r.seasonal_switches_section && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-[#02331E] text-sm mb-3 flex items-center gap-2">
                    <Sun size={15} className="text-[#D4B038]" /> Seasonal Switches
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {r.seasonal_switches_section.summer && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wide">Summer</p>
                        <p className="text-sm text-gray-700">{r.seasonal_switches_section.summer}</p>
                      </div>
                    )}
                    {r.seasonal_switches_section.winter && (
                      <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-sky-600 mb-1 uppercase tracking-wide">Winter</p>
                        <p className="text-sm text-gray-700">{r.seasonal_switches_section.winter}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Summary */}
              {r.summary_section?.length > 0 && (
                <div className="bg-[#02331E]/5 border border-[#02331E]/10 rounded-2xl p-5">
                  <h3 className="font-semibold text-[#02331E] text-sm mb-3">Key Takeaways</h3>
                  <ul className="space-y-2">
                    {r.summary_section.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={14} className="text-[#02331E] mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ── Catalogue Recommendations ── */}
              <div>
                {/* B2B DB recommendations */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Package size={16} className="text-[#D4B038]" />
                    <h3 className="font-semibold text-[#02331E] text-sm">Your Catalogue Matches</h3>
                    {recsLoading && <Spinner />}
                    {!recsLoading && recs && (
                      <span className="text-xs text-gray-400 ml-auto">{recs.length} matched</span>
                    )}
                  </div>

                  {recsLoading && (
                    <div className="space-y-3">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                          <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
                          <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
                          <div className="h-3 bg-gray-100 rounded w-full" />
                        </div>
                      ))}
                    </div>
                  )}

                  {!recsLoading && recs?.length === 0 && (
                    <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-400 text-sm">
                      No catalogue matches yet. Add products to your catalogue to see matches here.
                    </div>
                  )}

                  {!recsLoading && recs?.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recs.map((rec, i) => (
                        <motion.div
                          key={rec.product_id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="bg-white rounded-xl border border-[#D4B038]/20 shadow-sm p-4 hover:shadow-md transition"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-start gap-2">
                              <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${i === 0 ? "bg-[#D4B038] text-[#02331E]" : "bg-gray-100 text-gray-500"}`}>
                                {i + 1}
                              </span>
                              <div>
                                <p className="text-xs text-gray-400">{rec.brand}</p>
                                <p className="font-semibold text-[#02331E] text-sm leading-tight">{rec.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {rec.price_cents && (
                                <span className="text-xs font-bold text-[#02331E]">
                                  {rec.currency} {(rec.price_cents / 100).toFixed(0)}
                                </span>
                              )}
                              {rec.url && (
                                <a href={rec.url} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#02331E] hover:border-[#02331E]/30 transition">
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Match score */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, Math.round(rec.score * 100))}%` }}
                                transition={{ delay: i * 0.06 + 0.3, duration: 0.6 }}
                                className="h-full bg-gradient-to-r from-[#D4B038] to-[#02331E] rounded-full"
                              />
                            </div>
                            <span className="text-xs font-semibold text-[#02331E] w-10 text-right">
                              {Math.min(100, Math.round(rec.score * 100))}%
                            </span>
                          </div>

                          {rec.matched_on?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {rec.matched_on.map((t, j) => (
                                <span key={j} className={`text-xs px-2 py-0.5 rounded-full capitalize ${tagColor(t)}`}>
                                  {t.replace(/_/g, " ")}
                                </span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!result && !scanning && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Sparkles size={40} className="text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">Select a user, upload a photo and run a scan to see full results here</p>
          </div>
        )}

      </main>
    </div>
  );
}
