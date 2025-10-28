import { useState } from "react";
import { X, MessageCircle, Camera } from "lucide-react";
import { useEffect } from "react";
import { Api } from "@/shared/api/api";
import { motion } from "framer-motion";
import SubscribeButton from "../button/Subscribe";
import useAuthStore from "@/store/authStore";
import { cn } from "@/lib/utils";

const SkinPopup = ({ isOpen, onClose, selectedItem, onChatClick }) => {
  if (!isOpen || !selectedItem) return null;
  const [price, setPrice] = useState("");
  const { isSubscribed, shadeMatching, skinAnalysis, isFreeScan } =
    useAuthStore();
  useEffect(() => {
    const fetchPrices = async () => {
      const response = await Api.client.prices();
      setPrice(response);
    };
    fetchPrices();
  }, []);
  const getScanLabel = () => {
    if (isFreeScan) {
      return "1 Free Scan";
    }
    if (!isFreeScan && !shadeMatching && selectedItem.title === "True Tone") {
      return "Quick Scan $1 Only";
    }
    if (!isFreeScan && !skinAnalysis && selectedItem.title === "Derm Direct") {
      return "Quick Scan $1 Only";
    }
    if (!isFreeScan && shadeMatching && selectedItem.title === "True Tone") {
      return "1 Scan Available";
    }
    if (!isFreeScan && skinAnalysis && selectedItem.title === "Derm Direct") {
      return "1 Scan Available";
    }
    return "";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full mx-4 shadow-xl">
        {/* Header */}
        <div className="flex  items-center justify-between bg-[linear-gradient(90deg,#02331E_0%,#046E3C_100%)] rounded-t-2xl  p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="">
              <h2 className="text-lg font-bold text-white">
                {selectedItem.title}
              </h2>
              <p className="text-sm text-white">{selectedItem.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors "
          >
            <X className="w-5 h-5 text-white flex justify-end" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Chat Option */}
            <button
              onClick={() => onChatClick(selectedItem)}
              className=" relative w-full group bg-[#f5f5f5] border border-[#D4B0384D] rounded-xl p-4  transition-all duration-300 hover:shadow-md"
            >
              <div className="absolute -top-2 -right-2 bg-[linear-gradient(90deg,#D4B038_0%,#E9C84C_100%)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                FREE
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-[#02331E1A] rounded-[8px] flex items-start justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className=" text-[#02331E]" />
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
            <SubscribeButton route={selectedItem.scanRoute}>
              <div className="relative w-full bg-[#f5f5f5] border border-[#D4B0384D]  rounded-xl p-4 ">
                <div className="absolute -top-2 -right-2 bg-[linear-gradient(90deg,#D4B038_0%,#E9C84C_100%)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                  {getScanLabel()}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-[8px] flex items-center justify-center">
                      <Camera className=" text-[#02331E]" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-[#02331E] mb-1">
                        Scan
                      </h3>
                      <p className="text-sm text-[#4B5563]">
                        Analyze My Skin and in 30-seconds get photo analysis &
                        personalized recommendations 🔒 Private & secure photos
                        are deleted after analysis
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SubscribeButton>
            {!isSubscribed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.4 },
                }}
                className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-medium mt-4 shadow-sm text-center"
              >
                For Scanning Pricing starts from {price["usd"]} USD OR{" "}
                {price["gbp"]} GBP Country based. Subscribe now
              </motion.div>
            )}
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

export default SkinPopup;
