"use client";

import { MessageCircle, X, Sparkles, Camera, Gift } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginScanPopup = ({ onClose }) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50   bg-black/50 flex items-center justify-center p-4">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-sm bg-[#0B120F] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">

        {/* Header */}
        <div className="relative bg-[#02331E] p-8 pt-12 text-white overflow-hidden">

          {/* Gold Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,176,56,0.15)_0%,transparent_60%)]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md mb-6 border border-white/10">
            <Camera className="w-7 h-7 text-[#D4B038]" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-serif leading-tight mb-3">
            Unlock Your Free <br /> Skin Analysis
          </h1>

          <p className="text-white/70 text-sm leading-relaxed max-w-[85%]">
            Get personalized skincare insights powered by our proprietary AI technology.
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-7 bg-[#F5F5F5] dark:bg-[#0B120F]">

          {/* Feature List */}
          {[
            {
              icon: <Sparkles className="w-4 h-4 text-[#D4B038]" />,
              title: "AI-Powered Analysis",
              desc: "Advanced skin analysis in seconds",
            },
            {
              icon: <Gift className="w-4 h-4 text-[#D4B038]" />,
              title: "Free Scan",
              desc: "Get your scan absolutely free",
            },
            {
              icon: <MessageCircle className="w-4 h-4 text-[#D4B038]" />,
              title: "Unlimited Chat",
              desc: "Unlock unlimited free consultation chats",
            },
            {
              icon: <Camera className="w-4 h-4 text-[#D4B038]" />,
              title: "Personalized Recommendations",
              desc: "Custom skincare routine just for you",
            },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D4B038]/10 flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-[#02331E] text-[15px]">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="px-8 pb-10 space-y-4 bg-[#F5F5F5] dark:bg-[#0B120F]">

          <button
            onClick={() => router.push("/login")}
            className="w-full bg-[#02331E] py-4 rounded-full font-semibold text-white shadow-lg active:scale-[0.98] transition"
          >
            Log In to Get Free Unlimited Scan
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="w-full border-2 border-[#02331E]/20 py-4 rounded-full font-semibold text-[#02331E] active:scale-[0.98] transition"
          >
            Create Account
          </button>

          <p className="text-center text-[12px] text-gray-400 px-4 leading-relaxed">
            Join thousands of users getting personalized skin and lifestyle advice daily.
          </p>
        </div>

        {/* Bottom Handle */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/10 rounded-full"></div>

      </div>
    </div>
  );
};

export default LoginScanPopup;
