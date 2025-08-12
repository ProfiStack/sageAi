import { useState } from "react";
import { X, MessageCircle, Camera } from "lucide-react";

const OptionPopup = ({
  isOpen,
  onClose,
  selectedItem,
  onChatClick,
  onScanClick,
}) => {
  if (!isOpen || !selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10 rounded-full flex items-center justify-center text-[#D4B038]">
              <selectedItem.icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#02331E]">
                {selectedItem.title}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedItem.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Chat Option */}
            <button
              onClick={() => onChatClick(selectedItem)}
              className="w-full group bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-4 hover:border-emerald-200 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-emerald-800 mb-1">
                      Chat
                    </h3>
                    <p className="text-sm text-emerald-600">
                      Text-based consultation
                    </p>
                  </div>
                </div>
                <div className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium">
                  FREE
                </div>
              </div>
            </button>

            {/* Scan Option - Coming Soon */}
            <button
              onClick={onScanClick}
              className="w-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 opacity-75 cursor-not-allowed relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-600 mb-1">Scan</h3>
                    <p className="text-sm text-gray-500">
                      AI-powered image analysis
                    </p>
                  </div>
                </div>
                <div className="bg-amber-100 text-amber-600 text-xs px-3 py-1 rounded-full font-medium">
                  COMING SOON
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center">
            Choose the option that best fits your needs
          </p>
        </div>
      </div>
    </div>
  );
};

export default OptionPopup;
