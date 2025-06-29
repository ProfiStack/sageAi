import React, { useEffect } from "react";
import { X, Sparkles } from "lucide-react";

export default function ThanksPopup({
  isOpen = true,
  onClose = () => {},
  skinType = "combination",
  skinConcern = "acne and dark spots",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-full">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Skincare Consultant
              </h2>
              <p className="text-sm text-gray-600">
                Your personalized beauty guide
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">
              Hi, I'm your skincare consultant. Thanks for sharing you have{" "}
              <span className="font-semibold text-pink-600">{skinType}</span>{" "}
              skin and you're looking to improve{" "}
              <span className="font-semibold text-purple-600">
                {skinConcern}
              </span>
              . If you want to change your answers, you can change them in the
              personal details page.
            </p>
          </div>

          {/* Close button at bottom */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
