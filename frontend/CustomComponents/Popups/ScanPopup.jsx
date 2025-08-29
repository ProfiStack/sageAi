"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageAnalysisData } from "@/mockData/imageAnalysisPopupData";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import SubscribeButton from "../button/Subscribe";

const ScanPopup = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  useEffect(() => {
    ImageAnalysisData.forEach((item) => {
      router.prefetch(item.route);
    });
  }, []);
  const { isSubscribed } = useAuthStore();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 2 } }}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10 rounded-xl p-6 w-[90%] max-w-md shadow-lg relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-lg font-semibold mb-1 text-center">
              Choose Scan Type
            </h2>
            <p className="text-gray-600 text-sm text-center mb-2">
              Select the type of scan you want to perform
            </p>

            {/* Grid of options */}
            <div className="grid grid-cols-2 gap-3">
              {ImageAnalysisData.map((item, index) =>
                item.title === "Skin Analysis" || item.title === 'Shade Matching' ? (
                  <SubscribeButton route={item.route}>
                    <div
                      key={index}
                      onClick={() => {
                        setIsOpen(false);
                        if (isSubscribed) {
                          router.push(item.route);
                        }
                      }}
                      className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                    >
                      <div className="w-full h-40 rounded-2xl relative">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover rounded-2xl"
                        />
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          {item.title === "Skin Analysis" || item.title === 'Shade Matching'
                            ? !isSubscribed
                              ? "Subscribe Now"
                              : " Subscribed"
                            : "Coming Soon"}
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm mt-1">
                        {item.title}
                      </p>
                    </div>
                  </SubscribeButton>
                ) : (
                  <div
                    key={index}
                    onClick={() => {
                      setIsOpen(false);
                      if (isSubscribed) {
                        router.push(item.route);
                      }
                    }}
                    className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div className="w-full h-40 rounded-2xl relative">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded-2xl"
                      />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        {item.title === "Skin Analysis" || item.title === 'Shade Matching'
                          ? isSubscribed
                            ? "Subscribed"
                            : "Subscribe Now"
                          : "Coming Soon"}
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm mt-1">
                      {item.title}
                    </p>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScanPopup;
