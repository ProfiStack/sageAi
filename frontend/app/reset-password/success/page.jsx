"use client";

import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResetPasswordSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col">
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="px-6 py-8 text-center">
          {/* Success Animation */}
          <div className="w-32 h-32 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
          </div>

          {/* Content */}
          <h2 className="text-2xl font-bold text-[#02331E] mb-4">
            Password Reset Complete!
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Your password has been successfully updated. You can now sign in
            with your new password.
          </p>

          {/* Success Card */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl px-4 py-4 border border-emerald-100 shadow-sm mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-emerald-100 rounded-full p-1">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-emerald-700 font-medium text-sm">
                Your account is now secure with your new password
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-gradient-to-r from-[#D4B038] to-[#f4c842] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Continue to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
