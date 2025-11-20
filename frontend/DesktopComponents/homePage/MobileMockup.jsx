"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, ShoppingBag, User } from "lucide-react";

export function MobileMockup({ variant = "chat", className = "" }) {
  return (
    <div className={` relative ${className}`} style={{ perspective: "1000px" }}>
      {/* Phone Frame */}
      <div className="w-[280px] h-[580px] bg-gradient-to-br from-[#1a1a1a] to-[#121212] rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-3 relative  border-8 border-[#121212] hover:scale-105 transition-transform duration-500">
        {/* Screen */}
        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-[#02331E] to-[#024029] flex items-center justify-between px-6 z-10">
            <span className="text-white text-xs">9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2 bg-white/50 rounded-sm"></div>
              <div className="w-4 h-2 bg-white/70 rounded-sm"></div>
              <div className="w-4 h-2 bg-white rounded-sm"></div>
            </div>
          </div>

          {/* Content based on variant */}
          {variant === "chat" && <ChatVariant />}
          {variant === "scan" && <ScanVariant />}
          {variant === "profile" && <ProfileVariant />}
          {variant === "products" && <ProductsVariant />}

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 flex items-center justify-around px-4">
            <Sparkles className="text-[#02331E]" size={24} />
            <ShoppingBag className="text-gray-400" size={24} />
            <User className="text-gray-400" size={24} />
            <Heart className="text-gray-400" size={24} />
          </div>
        </div>

        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#121212] rounded-b-3xl"></div>
      </div>

      {/* Enhanced Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4B038] to-[#02331E] rounded-[3rem] blur-3xl opacity-40 -z-10 animate-pulse"></div>
      <div className="absolute inset-0 bg-[#D4B038] rounded-[3rem] blur-2xl opacity-30 -z-10"></div>
    </div>
  );
}

function ChatVariant() {
  return (
    <div className="pt-16 pb-24 px-4 h-full overflow-hidden bg-gradient-to-b from-[#F5F5F5] to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
        className="space-y-3"
      >
        {/* Message from AI */}
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-[#02331E] flex-shrink-0"></div>
          <div className="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm max-w-[70%]">
            <p className="text-xs text-[#121212]">
              Based on your skin type, I recommend a gentle cleanser with
              hyaluronic acid.
            </p>
          </div>
        </div>

        {/* Message from User */}
        <div className="flex gap-2 justify-end">
          <div className="bg-[#02331E] rounded-2xl rounded-tr-sm p-3 shadow-sm max-w-[70%]">
            <p className="text-xs text-white">What about retinol?</p>
          </div>
        </div>

        {/* Typing indicator */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-[#02331E] flex-shrink-0"></div>
          <div className="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ScanVariant() {
  return (
    <div className="pt-16 pb-24 h-full bg-[#121212] flex items-center justify-center">
      <div className="relative">
        {/* Scanning Frame */}
        <div className="w-48 h-48 border-4 border-[#D4B038] rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4B038]/20 to-transparent"></div>
          <motion.div
            animate={{ y: [0, 192, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-[#D4B038] shadow-[0_0_20px_rgba(212,176,56,0.8)]"
          ></motion.div>
        </div>
        <p className="text-white text-center mt-4 text-xs">
          Scanning product...
        </p>
      </div>
    </div>
  );
}

function ProfileVariant() {
  return (
    <div className="pt-16 pb-24 px-4 h-full overflow-hidden bg-gradient-to-b from-[#F5F5F5] to-white">
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#02331E] to-[#D4B038] mx-auto mb-3"></div>
        <h3 className="text-sm text-[#121212]">Sarah M.</h3>
        <p className="text-xs text-gray-500">Combination Skin</p>
      </div>

      <div className="space-y-3">
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <p className="text-xs text-gray-500 mb-1">Skin Health Score</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "85%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-[#02331E] to-[#D4B038]"
              ></motion.div>
            </div>
            <span className="text-sm text-[#02331E]">85%</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Routines</p>
            <p className="text-lg text-[#02331E]">12</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Products</p>
            <p className="text-lg text-[#02331E]">24</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsVariant() {
  return (
    <div className="pt-16 pb-24 px-4 h-full overflow-y-auto bg-gradient-to-b from-[#F5F5F5] to-white">
      <h3 className="text-sm text-[#121212] mb-4">Recommended for you</h3>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-3"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#02331E]/10 to-[#D4B038]/10 rounded-xl flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#121212] truncate">
                Product Name {i}
              </p>
              <p className="text-xs text-gray-500">Skincare</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-[#D4B038] text-xs">
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">4.{8 + i}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
