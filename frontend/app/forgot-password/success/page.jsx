"use client";

import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordSuccessPage() {
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();

  useState(() => {
    // Get email from URL params
    const urlParams = new URLSearchParams(window.location.search);
    setEmail(urlParams.get("email") || "");
  }, []);

  const handleResend = async () => {
    setIsResending(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col">
      <div className="flex-1 bg-white">
        {/* Header */}
        <SettingsHeader title={"Success"} />

        <div className="px-6 py-8 text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          {/* Content */}
          <h2 className="text-2xl font-bold text-[#02331E] mb-4">
            Email Sent Successfully!
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            We've sent a password reset link to:
          </p>
          <p className="text-[#D4B038] font-semibold mb-6">{email}</p>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Please check your email and click the link to reset your password.
            The link will expire in 24 hours for security reasons.
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

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="w-full bg-gradient-to-r from-[#D4B038] to-[#f4c842] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
            >
              {isResending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Resending...</span>
                </div>
              ) : (
                "Resend Email"
              )}
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
