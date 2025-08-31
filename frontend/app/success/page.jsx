'use client'
import React, { useState, useEffect } from 'react';
import { CheckCircle, Download, Mail, ArrowRight, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Api } from '@/shared/api/api';
import useAuthStore from '@/store/authStore';
import { logEvent } from '@amplitude/analytics-browser';

export default function StripeSuccessPage() {
  const [showAnimation, setShowAnimation] = useState(false);
  const router = useRouter();
  const { token, setIsSubscribed } = useAuthStore();
  useEffect(() => {
    setShowAnimation(true);
    const fetchProfile = async () => {
      const profile = await Api.client.getProfile(token)
      if (profile.subscription_status === 'active') {
        setIsSubscribed(true)
      } else {
        setIsSubscribed(false);
      }
    }
    fetchProfile();
    logEvent("Subscription Clicked", {
      click_value: "Essential",
    });
  }, [token]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <div className={`text-center mb-8 transform transition-all duration-1000 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto relative z-10" />
            </div>
          </div>

          {/* Main Success Card */}
          <div className={`bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-1000 delay-300 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Payment Successful! 🎉
              </h1>
              <p className="text-xl text-gray-600">
                Thank you for subscribing to Sagee.
              </p>
            </div>

            {/* Order Details */}
            {/* <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-semibold text-gray-900">{orderData?.orderNumber}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold text-gray-900 text-lg">{orderData?.amount} {orderData?.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-semibold text-gray-900">{orderData?.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">{orderData?.date}</p>
                </div>
              </div>
            </div> */}

            {/* What's Next Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  {/* <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-3 h-3 text-blue-600" />
                  </div> */}
                  {/* <div>
                    <p className="font-medium text-gray-900">Email Confirmation</p>
                    <p className="text-sm text-gray-600">We've sent a confirmation email to {orderData?.customerEmail}</p>
                  </div> */}
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Download className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Welcome to sage</p>
                    <p className="text-sm text-gray-600">Your payment is successful please click on continue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg">
                Download Receipt
                <Download className="w-4 h-4" />
              </button> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* <button className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2">
                  Track Order
                  <ArrowRight className="w-4 h-4" />
                </button> */}
                <button onClick={() => router.push('/home')} className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                  Continue
                </button>
              </div>
            </div>

            {/* Support Note */}
            {/* <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Need help? <a href="/support" className="text-blue-600 hover:text-blue-700 font-medium">Contact our support team</a>
              </p>
            </div> */}
          </div>

          {/* Security Badge */}
          <div className={`text-center mt-8 transform transition-all duration-1000 delay-500 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
          </div>
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md fixed bottom-[2%] left-[30%]">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-medium">Secured by Stripe</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}