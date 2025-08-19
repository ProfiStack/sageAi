"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Basic validation
    if (!email) {
      setErrors({ email: "Email is required" });
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Please enter a valid email address" });
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to success page
      router.push(
        `/forgot-password/success?email=${encodeURIComponent(email)}`
      );
    } catch (error) {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col">
      <div className="flex-1 bg-white">
        {/* Header */}
        <SettingsHeader title={"Forgot Password"} />

        <div className="px-6 py-8">
          {/* Logo */}
          <div className="relative w-[78px] h-[78px] mx-auto mb-8">
            <Image
              src="/images/sagelogo2.png"
              alt="SageeAi"
              layout="fill"
              objectFit="contain"
            />
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#02331E] mb-3">
              Forgot Your Password?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              No worries! Enter your email address and we'll send you a link to
              reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#02331E]"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#D4B038]/20 focus:border-[#D4B038] transition-colors duration-200 ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#D4B038] to-[#f4c842] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-8">
            <button
              onClick={() => router.push("/")}
              className="text-[#D4B038] font-medium text-sm hover:underline transition-all duration-200"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
