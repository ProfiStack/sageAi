"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload, ScanFace, ArrowLeft, CheckCircle2,
  AlertCircle, ChevronRight, Camera, X, Droplets,
  Sparkles, User,
} from "lucide-react";
import { Api } from "@/shared/api/api";
import useB2BStore from "@/store/b2bStore";

export default function B2BScanPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { apiKey, isAuthenticated } = useB2BStore();

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(params.get("userId") || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/b2b-portal");
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
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleImage(file);
  };

  const handleScan = async () => {
    if (!selectedUserId || !imageFile) return;
    setScanning(true);
    setError("");
    setResult(null);
    try {
      const res = await Api.b2b.scanUser(apiKey, selectedUserId, imageFile);
      if (res?.scan_id) {
        setResult(res);
      } else {
        setError(res?.detail || "Scan failed. Please try again.");
      }
    } catch {
      setError("Failed to complete the scan.");
    } finally {
      setScanning(false);
    }
  };

  const skinToneColors = {
    fair: "#FCEBD5", light: "#F5D5B0", medium: "#D4A574", olive: "#C4935A",
    tan: "#A67C52", dark: "#6B4226", deep: "#3D1F0D",
  };

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      {/* Header */}
      <header className="bg-[#02331E] text-white px-6 py-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push("/b2b-portal/dashboard")}
            className="flex items-center gap-2 text-white/70 hover:text-white transition text-sm"
          >
            <ArrowLeft size={16} /> Dashboard
          </button>
          <span className="text-white/30">|</span>
          <div className="flex items-center gap-2">
            <ScanFace size={18} className="text-[#D4B038]" />
            <span className="font-semibold">Skin Analysis Scan</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left — setup */}
          <div className="space-y-5">
            {/* Step 1 — select user */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
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
                  <option key={u.id} value={u.id}>
                    {u.email || u.external_user_id}
                  </option>
                ))}
              </select>
              {users.length === 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  No users yet.{" "}
                  <button
                    onClick={() => router.push("/b2b-portal/dashboard")}
                    className="text-[#02331E] underline"
                  >
                    Create one first
                  </button>
                </p>
              )}
            </div>

            {/* Step 2 — upload image */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#02331E] text-white text-xs font-bold flex items-center justify-center">2</span>
                <span className="font-semibold text-[#02331E] text-sm">Upload Skin Image</span>
              </div>

              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => !imagePreview && fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl transition cursor-pointer ${
                  imagePreview
                    ? "border-[#02331E]/30 bg-[#02331E]/5"
                    : "border-gray-200 hover:border-[#02331E]/40 hover:bg-[#02331E]/3"
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImage(e.target.files[0])}
                />
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-52 object-cover rounded-xl"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); setResult(null); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle2 size={11} /> Image ready
                    </div>
                  </div>
                ) : (
                  <div className="py-10 flex flex-col items-center gap-2 text-gray-400">
                    <Camera size={28} className="text-gray-300" />
                    <p className="text-sm font-medium text-gray-500">Drop image here or click to browse</p>
                    <p className="text-xs">JPG, PNG, WebP — face clearly visible</p>
                  </div>
                )}
              </div>
            </div>

            {/* Run scan button */}
            <button
              onClick={handleScan}
              disabled={!selectedUserId || !imageFile || scanning}
              className="w-full flex items-center justify-center gap-2 bg-[#02331E] hover:bg-[#024029] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-all group"
            >
              {scanning ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                  </svg>
                  Analysing skin...
                </>
              ) : (
                <>
                  <ScanFace size={18} />
                  Run Skin Analysis
                </>
              )}
            </button>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                <AlertCircle size={15} /> {error}
              </div>
            )}
          </div>

          {/* Right — results */}
          <div>
            <AnimatePresence mode="wait">
              {!result && !scanning && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200"
                >
                  <Sparkles size={36} className="text-gray-200 mb-3" />
                  <p className="text-gray-400 text-sm">Scan results will appear here</p>
                </motion.div>
              )}

              {scanning && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-[#02331E]/10 flex items-center justify-center mb-4 animate-pulse">
                    <ScanFace size={28} className="text-[#02331E]" />
                  </div>
                  <p className="text-[#02331E] font-semibold">Analysing skin features...</p>
                  <p className="text-gray-400 text-sm mt-1">This usually takes 5–15 seconds</p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Success banner */}
                  <div className="bg-[#02331E] text-white rounded-2xl p-4 flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#D4B038] flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Scan complete</p>
                      <p className="text-white/60 text-xs">ID: {result.scan_id}</p>
                    </div>
                  </div>

                  {/* Results grid */}
                  {result.results && (() => {
                    const r = result.results;
                    const toneKey = (r.skin_tone || r.tone || "").toLowerCase();
                    const toneColor = skinToneColors[toneKey] || "#D4A574";

                    return (
                      <div className="space-y-3">
                        {/* Skin type + tone row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Skin Type</p>
                            <p className="font-semibold text-[#02331E] capitalize">{r.skin_type || "—"}</p>
                          </div>
                          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Skin Tone</p>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded-full border border-gray-200 flex-shrink-0"
                                style={{ background: toneColor }}
                              />
                              <p className="font-semibold text-[#02331E] capitalize">{r.skin_tone || r.tone || "—"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Undertone + texture */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Undertone</p>
                            <p className="font-semibold text-[#02331E] capitalize">{r.undertone || "—"}</p>
                          </div>
                          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Texture</p>
                            <p className="font-semibold text-[#02331E] capitalize">{r.texture || "—"}</p>
                          </div>
                        </div>

                        {/* Concerns */}
                        {r.concerns?.length > 0 && (
                          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Skin Concerns</p>
                            <div className="flex flex-wrap gap-2">
                              {r.concerns.map((c, i) => (
                                <span key={i} className="bg-[#02331E]/8 text-[#02331E] text-xs px-3 py-1 rounded-full capitalize">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Summary */}
                        {r.summary && (
                          <div className="bg-[#D4B038]/10 border border-[#D4B038]/20 rounded-xl p-4">
                            <p className="text-xs font-semibold text-[#b8860b] mb-1 uppercase tracking-wide">AI Summary</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{r.summary}</p>
                          </div>
                        )}

                        {/* View recommendations CTA */}
                        <button
                          onClick={() => router.push(`/b2b-portal/recommendations?userId=${selectedUserId}`)}
                          className="w-full flex items-center justify-center gap-2 border-2 border-[#02331E] text-[#02331E] hover:bg-[#02331E] hover:text-white font-semibold py-3 px-6 rounded-xl transition-all group text-sm"
                        >
                          <Droplets size={16} />
                          View Product Recommendations
                          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
