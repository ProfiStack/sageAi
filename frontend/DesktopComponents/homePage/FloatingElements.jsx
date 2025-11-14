"use client";

import { motion } from "framer-motion";
import { Sparkles, Star, Zap } from "lucide-react";

export function FloatingElements() {
  return (
    <>
      {/* Floating Icons with different animations */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-20 text-[#D4B038] opacity-30  drop-shadow-lg"
        style={{ filter: "drop-shadow(0 0 10px rgba(212, 176, 56, 0.5))" }}
      >
        <Sparkles size={40} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 30, 0],
          rotate: [0, -10, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-1/3 right-32 text-[#02331E] opacity-25  drop-shadow-lg"
        style={{ filter: "drop-shadow(0 0 8px rgba(2, 51, 30, 0.5))" }}
      >
        <Star size={32} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -25, 0],
          rotate: [0, 8, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute bottom-1/3 right-20 text-[#D4B038] opacity-30  drop-shadow-lg"
        style={{ filter: "drop-shadow(0 0 10px rgba(212, 176, 56, 0.5))" }}
      >
        <Zap size={36} />
      </motion.div>

      {/* Floating Circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full border-2 border-[#D4B038] "
        style={{ boxShadow: "0 0 20px rgba(212, 176, 56, 0.3)" }}
      ></motion.div>

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.35, 0.2],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute bottom-1/4 right-1/3 w-24 h-24 rounded-full border-2 border-[#02331E] "
        style={{ boxShadow: "0 0 20px rgba(2, 51, 30, 0.3)" }}
      ></motion.div>

      {/* Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 right-1/4 w-20 h-20 rounded-full bg-gradient-to-br from-[#D4B038]/30 to-[#02331E]/30 blur-xl "
      ></motion.div>

      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/3 left-1/3 w-28 h-28 rounded-full bg-gradient-to-br from-[#02331E]/30 to-[#D4B038]/30 blur-xl "
      ></motion.div>
    </>
  );
}
