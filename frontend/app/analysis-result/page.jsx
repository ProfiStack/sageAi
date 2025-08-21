"use client";

import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import { useSkinResultStore } from "@/store/skinResult";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResultsPage() {
  const html = useSkinResultStore((state) => state.html);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!html) return <p>No results yet.</p>;

  return (
    <>
      <SettingsHeader title={"Result"} />

      <div dangerouslySetInnerHTML={{ __html: html }} />

      {/* Sticky Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed flex font-semibold  gap-2 right-4 bottom-10 -translate-y-1/2 bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10 text-[#02331E] bg-white px-4 py-2 rounded-full shadow-lg  transition z-50"
      >
        <MessageCircle size={24} className="text-[#02331E]" />
        Chat
      </button>

      {/* Popup */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-auto transform transition-all duration-300 ease-out scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors duration-200 group"
              aria-label="Close dialog"
            >
              X
            </button>

            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle size={34} className="text-[#02331E]" />
              </div>

              {/* Title */}
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900 mb-3"
              >
                Chat with our AI Consultant
              </h2>

              {/* Description */}
              <p
                id="modal-description"
                className="text-gray-600 mb-8 leading-relaxed"
              >
                Get personalized skincare advice and product recommendations
                from our AI-powered consultant.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/skincare/chat")}
                className="flex-1 bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10 text-[#02331E] py-3 px-6 rounded-xl  transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                Start Chat
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gray-50 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300 font-medium"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
