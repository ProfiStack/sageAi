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
        <div className="flex items-center justify-between p-6  bg-[linear-gradient(90deg,#02331E_0%,#046E3C_100%)] rounded-t-2xl">
          <div className="flex space-x-3">
            <div>
              <h2 className="text-lg font-bold text-white">
                {selectedItem.title}
              </h2>
              <p className="text-sm text-white ">{selectedItem.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Chat Option */}
            <button
              onClick={() => onChatClick(selectedItem)}
              className="relative w-full group bg-[#f5f5f5] rounded-xl p-4  transition-all duration-300 hover:shadow-md"
            >
              <div className="absolute -top-2 -right-2 bg-[linear-gradient(90deg,#D4B038_0%,#E9C84C_100%)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                FREE
              </div>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#02331E1A] rounded-[8px] p-1 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-6 h-6 text-[#02331E]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-[#02331E] mb-1">Chat</h3>
                    <p className="text-sm text-[#4B5563]">
                      Ask me anything and get instant answers about your
                      routine, products, or concerns
                    </p>
                  </div>
                </div>
              </div>
            </button>
            <button
              onClick={onScanClick}
              className=" w-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 opacity-75 cursor-not-allowed relative"
            >
              <div className="absolute -top-2 -right-2 bg-[linear-gradient(90deg,#D4B038_0%,#E9C84C_100%)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                COMING SOON
              </div>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-[8px] p-1 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-600 mb-1">Scan</h3>
                    <p className="text-sm text-gray-500">
                      AI-powered image analysis
                    </p>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[linear-gradient(90deg,#02331E_0%,#046E3C_100%)] rounded-b-2xl">
          <p className="text-xs text-white text-center">
            Choose the option that best fits your needs
          </p>
        </div>
      </div>
    </div>
  );
};

export default OptionPopup;
