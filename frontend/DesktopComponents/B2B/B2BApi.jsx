"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { KeyRound, ArrowRight, Sparkles, ShieldCheck, Zap, BarChart3, AlertCircle } from "lucide-react";
import { Api } from "@/shared/api/api";
import useB2BStore from "@/store/b2bStore";

export default function B2BApi() {

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
          router.push("/b2b/dashboard");
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
    <div className="min-h-screen w-full bg-[#F5F5F5]  flex flex-col items-center justify-center px-4 relative overflow-hidden">
         <div className="mb-5 text-center">
            <div className="flex items-center gap-2 mb-2 justify-center">
            <div className="w-10 h-10 rounded-xl bg-[#02331E] flex items-center justify-center">
                  <KeyRound className="text-[#D4B038] " size={20} />
                </div>
            <h2 className="text-[28px] font-bold text-[#02331E] ">Sign in with API Key</h2>

            </div>
                  <p className="text-xl text-gray-500 text-center">Enter your business API key to access the portal</p>
                </div>
       
  
          {/* Right — login card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="w-full container mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-2xl lg:mx-40">
              <div className="flex items-center gap-3 mb-6">
               
               
              </div>
  
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
               <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#02331E]/10 flex items-center justify-center">
                  <KeyRound className="text-[#02331E]" size={20} />
                </div>
                  <label className="block text-lg font-semibold text-[#02331E] mb-2">
                    API Key
                  </label>
                  </div>
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
                <p className="lg:text-lg text-base font-medium text-gray-400 text-center">
                  Need an API key? Contact{" "}
                  <a href="mailto:sageeai@sageeai.com" className="text-[#02331E] underline">
                    sageeai@sageeai.com
                  </a>
                </p>
              </div>
            </div>
  
           
          </motion.div>
        </div>
      )}