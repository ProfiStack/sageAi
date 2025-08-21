"use client";

import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ForgotPasswordSuccessPage() {
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setEmail(urlParams.get("email") || "");
    }
  }, []);

  const handleResend = async () => {
    setIsResending(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col">
      <div className="flex-1 bg-white">
        <SettingsHeader title={"Success"} />

        <div className="px-6 py-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#02331E] mb-4">
            Email Sent Successfully!
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            We've sent a password reset link to:
          </p>
          <p className="text-[#D4B038] font-semibold mb-6">{email}</p>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Please check your email and click the link to reset your password.
          </p>

          {/* Did you know card */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl px-4 py-4 border border-emerald-100 shadow-sm mb-8">
            <div className="flex items-start space-x-3">
              <div className="bg-emerald-100 rounded-full p-1 flex-shrink-0">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-emerald-700 font-medium mb-1">
                  PRO TIP
                </p>
                <p className="text-gray-700 text-xs leading-relaxed">
                  Don't see the email? Check your spam or junk folder. Sometimes
                  our emails take a detour!
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="w-full bg-gradient-to-r from-[#D4B038] to-[#f4c842] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isResending ? "Resending..." : "Resend Email"}
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full bg-white text-[#02331E] font-semibold py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
