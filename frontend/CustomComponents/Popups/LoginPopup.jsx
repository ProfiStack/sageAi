"use client";
import { MessageCircle } from "lucide-react";
import { X, Sparkles, Camera, Gift } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginScanPopup = ({ onClose }) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 p-6 text-white overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-50"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Unlock Your Free Skin Analysis
            </h2>
            <p className="text-emerald-50 text-sm">
              Get personalized skincare insights powered by AI
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mt-0.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  AI-Powered Analysis
                </h3>
                <p className="text-gray-600 text-xs mt-0.5">
                  Advanced skin analysis in seconds
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mt-0.5">
                <Gift className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Free Scan
                </h3>
                <p className="text-gray-600 text-xs mt-0.5">
                  Get your scan absolutely free
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mt-0.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Unlimited Chat
                </h3>
                <p className="text-gray-600 text-xs mt-0.5">
                  Unlock unlimited free consultation chats
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mt-0.5">
                <Camera className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Personalized Recommendations
                </h3>
                <p className="text-gray-600 text-xs mt-0.5">
                  Custom skincare routine just for you
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                router.push("/login");
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Log In to Get Free unlimited Scan
            </button>

            <button
              onClick={() => {
                router.push("/signup");
              }}
              className="w-full bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Account
            </button>
          </div>

          {/* Footer text */}
          <p className="text-center text-xs text-gray-500 pt-2">
            Join thousands of users getting personalized skin and lifestyle
            advice
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginScanPopup;
