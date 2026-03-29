"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { KeyRound, ArrowRight, Sparkles, ShieldCheck, Zap, BarChart3, AlertCircle } from "lucide-react";
import { Api } from "@/shared/api/api";
import useB2BStore from "@/store/b2bStore";

export default function B2BPortalLogin() {
  const router = useRouter();
  const { setAuth } = useB2BStore();
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await Api.b2b.verifyKey(apiKey.trim());
      // If response is an array (users list) or no error field → valid key
      if (Array.isArray(res) || (res && !res.detail)) {
        setAuth({ apiKey: apiKey.trim(), clientId: null, clientName: "Your Business" });
        router.push("/b2b-portal/dashboard");
      } else {
        setError(res?.detail || "Invalid API key. Please check and try again.");
      }
    } catch {
      setError("Unable to connect. Please check the API key.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Zap size={18} />, text: "AI-powered skin analysis in seconds" },
    { icon: <ShieldCheck size={18} />, text: "Fully isolated per-client data" },
    { icon: <BarChart3 size={18} />, text: "Personalised product recommendations" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02331E] via-[#02331E]/95 to-[#024029] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-10 w-80 h-80 bg-[#D4B038] rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-10 w-96 h-96 bg-[#D4B038]/40 rounded-full blur-3xl"
      />

      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Left — branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 bg-[#D4B038]/20 text-[#D4B038] px-4 py-2 rounded-full mb-6 border border-[#D4B038]/30 w-fit">
            <Sparkles size={15} />
            <span className="text-sm font-medium">B2B Developer Portal</span>
          </div>
          <h1 className="text-4xl lg:text-5xl text-white font-bold leading-tight mb-4">
            SageAI<br />
            <span className="text-[#D4B038]">Business Portal</span>
          </h1>
          <p className="text-white/70 text-lg mb-8 leading-relaxed">
            Integrate AI skin analysis and personalised product recommendations
            directly into your platform.
          </p>
          <div className="space-y-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 text-white/80"
              >
                <span className="w-8 h-8 rounded-full bg-[#D4B038]/20 border border-[#D4B038]/30 flex items-center justify-center text-[#D4B038] flex-shrink-0">
                  {f.icon}
                </span>
                <span className="text-sm">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — login card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#02331E]/10 flex items-center justify-center">
                <KeyRound className="text-[#02331E]" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#02331E]">Sign in with API Key</h2>
                <p className="text-sm text-gray-500">Enter your business API key to access the portal</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your API key here..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02331E]/30 focus:border-[#02331E] text-sm font-mono transition"
                  autoComplete="off"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading || !apiKey.trim()}
                className="w-full flex items-center justify-center gap-2 bg-[#02331E] hover:bg-[#024029] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 group"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  <>
                    Access Portal
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                Need an API key? Contact{" "}
                <a href="mailto:hello@sageai.com" className="text-[#02331E] underline">
                  hello@sageai.com
                </a>
              </p>
            </div>
          </div>

          {/* Test hint */}
          <div className="mt-4 bg-[#D4B038]/10 border border-[#D4B038]/30 rounded-xl px-4 py-3">
            <p className="text-xs text-[#D4B038] font-medium mb-1">Test Account</p>
            <p className="text-xs text-white/60">
              Client: <span className="font-mono text-white/80">Gloss Beauty Co.</span>
            </p>
            <p className="text-xs text-white/60 mt-0.5">
              Use the API key from <span className="font-mono text-white/80">seed_b2b.py</span> output
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
