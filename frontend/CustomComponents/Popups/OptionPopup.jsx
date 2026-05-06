import { X } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const SCAN_IMAGE_MAP = {
  "Derm Direct": "/images/scan.jpeg",
  "Product Analysis": "/images/productAnalysis.jpeg",
  "Shade Matching": "/images/shadeMatching.jpeg",
};

const OptionPopup = ({ isOpen, onClose, selectedItem, onChatClick }) => {
  if (!isOpen || !selectedItem) return null;

  const scanImage = SCAN_IMAGE_MAP[selectedItem.title] ?? "/images/scan.jpeg";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-white via-[#F5F5F5] to-[#e8f2ed] rounded-3xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <motion.button
            className="w-9 h-9 rounded-full bg-[#F5F5F5] flex items-center justify-center active:bg-[#E8E8E8] transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            <X className="w-5 h-5 text-[#02331E]" strokeWidth={2.5} />
          </motion.button>

          <p className="text-[11px] font-semibold text-[#02331E]/60 uppercase tracking-[0.15em]">
            SAGEE AI
          </p>

          <div className="w-9" />
        </div>

        {/* Title */}
        <div className="px-6 py-4">
          <h1 className="text-[34px] font-semibold text-[#02331E] tracking-tight leading-tight">
            {selectedItem.title}
          </h1>
          <p className="text-sm text-[#02331E]/70 mt-1">
            {selectedItem.description}
          </p>
        </div>

        {/* Cards */}
        <div className="px-6 pb-8 space-y-4">

          {/* Chat Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="active:scale-[0.98] transition-transform"
          >
            <button
              onClick={() => onChatClick(selectedItem)}
              className="relative w-full h-[240px] rounded-[20px] overflow-hidden bg-[#02331E] shadow-lg text-left"
            >
              <div className="absolute inset-0">
                <Image
                  src="/images/chat.jpeg"
                  alt="Chat"
                  fill
                  className="object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#02331E]/50 via-[#02331E]/70 to-[#02331E]/95" />
              </div>

              <div className="absolute top-3 right-3">
                <div className="px-2.5 py-1 rounded-full bg-[#D4B038]">
                  <p className="text-[9px] font-semibold text-[#02331E] uppercase tracking-wide">
                    FREE
                  </p>
                </div>
              </div>

              <div className="relative h-full p-5 flex flex-col justify-end">
                <h3 className="text-[22px] font-semibold text-white mb-2 tracking-tight">
                  Chat
                </h3>
                <p className="text-[13px] text-white/80 font-normal mb-4 leading-relaxed">
                  Ask me anything and get instant answers about your routine, products, or concerns
                </p>
                <div className="w-full h-12 rounded-full bg-[#D4B038] flex items-center justify-center">
                  <span className="text-[15px] font-semibold text-[#02331E]">
                    SELECT CHAT
                  </span>
                </div>
              </div>
            </button>
          </motion.div>

          {/* Scan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="active:scale-[0.98] transition-transform"
          >
            <div className="relative h-[240px] rounded-[20px] overflow-hidden bg-[#02331E] shadow-lg opacity-90">
              <div className="absolute inset-0">
                <Image
                  src={scanImage}
                  alt="Scan"
                  fill
                  className="object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#02331E]/40 via-[#02331E]/65 to-[#02331E]/95" />
              </div>

              <div className="absolute top-3 right-3">
                <div className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  <p className="text-[9px] font-semibold text-white uppercase tracking-wide">
                    COMING SOON
                  </p>
                </div>
              </div>

              <div className="relative h-full p-5 flex flex-col justify-end">
                <h3 className="text-[22px] font-semibold text-white mb-2 tracking-tight">
                  Scan
                </h3>
                <p className="text-[13px] text-white/80 font-normal mb-4 leading-relaxed">
                  AI-powered image analysis
                </p>
                <button
                  disabled
                  className="w-full h-12 rounded-full bg-gray-500 flex items-center justify-center cursor-not-allowed"
                >
                  <span className="text-[15px] font-semibold text-white">
                    COMING SOON
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default OptionPopup;
