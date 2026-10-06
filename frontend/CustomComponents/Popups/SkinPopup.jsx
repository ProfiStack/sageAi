import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Api } from "@/shared/api/api";
import SubscribeButton from "../button/Subscribe";
import useAuthStore from "@/store/authStore";
import LoginScanPopup from "./LoginPopup";
import Image from "next/image";

const SCAN_IMAGE_MAP = {
  "Derm Direct": "/images/scan.jpeg",
  "Product Analysis": "/images/productAnalysis.jpeg",
  "True Tone": "/images/shadeMatching.jpeg",
};

const SkinPopup = ({ isOpen, onClose, selectedItem, onChatClick }) => {
  if (!isOpen || !selectedItem) return null;

  const [price, setPrice] = useState("");
  const [isloginOpen, setIsLoginOpen] = useState(false);
  const { isSubscribed, shadeMatching, skinAnalysis, isFreeScan, isAuthenticated } = useAuthStore();

  const scanImage = SCAN_IMAGE_MAP[selectedItem.title] ?? "/images/scan.jpeg";

  useEffect(() => {
    const fetchPrices = async () => {
      const response = await Api.client.prices();
      setPrice(response);
    };
    fetchPrices();
  }, []);

  const handleLoginPopup = () => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
    }
  };

  const handleClose = () => {
    setIsLoginOpen(false);
  };

  const getScanLabel = () => {
    if (isFreeScan) return "Free Scan";
    if (!isAuthenticated) return "Login";
    if (!isFreeScan && !shadeMatching && selectedItem.title === "True Tone") return "Quick Scan Free";
    if (!isFreeScan && !skinAnalysis && selectedItem.title === "Derm Direct") return "Quick Scan Free";
    if (!isFreeScan && shadeMatching && selectedItem.title === "True Tone") return "Quick Scan Free";
    if (!isFreeScan && skinAnalysis && selectedItem.title === "Derm Direct") return "Quick Scan Free";
    return "";
  };
 
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-white via-[#F5F5F5] to-[#e8f2ed] rounded-3xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="w-9 h-9 relative rounded-full overflow-hidden" >
          <Image
            src="/images/sagelogo.png"
            alt="SageAI Logo"
            fill
            className="object-cover w-full h-full"
          />
        </div>

         

          <p className="text-[11px] font-semibold text-[#02331E]/60 uppercase tracking-[0.15em]">
            SAGEE AI
          </p>
          <motion.button
            className="w-9 h-9 rounded-full bg-[#F5F5F5] flex items-center justify-center active:bg-[#E8E8E8] transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            <X className="w-5 h-5 text-[#02331E]" strokeWidth={2.5} />
          </motion.button>

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
                  priority
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
                  Consult via Chat
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
            <div className="relative h-[280px] rounded-[20px] overflow-hidden bg-[#02331E] shadow-lg">
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
                    {getScanLabel()}
                  </p>
                </div>
              </div>

              {/* Scanning Line */}
              <motion.div
                className="absolute left-0 right-0 h-[1px]"
                style={{
                  background: "linear-gradient(90deg, transparent, #D4B038 50%, transparent)",
                  boxShadow: "0 0 16px 2px rgba(212, 176, 56, 0.5)",
                }}
                animate={{ top: ["20%", "80%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              />

              <div className="relative h-full p-5 flex flex-col justify-end">
                <h3 className="text-[22px] font-semibold text-white mb-2 tracking-tight">
                  Instant Scan
                </h3>
                <p className="text-[13px] text-white/80 font-normal mb-4 leading-relaxed">
                  Analyze My Skin and in 30-seconds get personalized recommendations. Private & secure — photos are deleted after analysis
                </p>

                {isAuthenticated ? (
                  <SubscribeButton route={selectedItem.scanRoute}>
                    <div className="w-full h-12 rounded-full bg-[#D4B038] flex items-center justify-center active:bg-[#c9a735] transition-colors">
                      <span className="text-[15px] font-semibold text-[#02331E]">
                        START SCAN
                      </span>
                    </div>
                  </SubscribeButton>
                ) : (
                  <button
                    onClick={handleLoginPopup}
                    className="w-full h-12 rounded-full bg-[#D4B038] active:bg-[#c9a735] transition-colors flex items-center justify-center"
                  >
                    <span className="text-[15px] font-semibold text-[#02331E]">
                      LOGIN TO SCAN
                    </span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {isloginOpen && <LoginScanPopup onClose={handleClose} />}
    </div>
  );
};

export default SkinPopup;