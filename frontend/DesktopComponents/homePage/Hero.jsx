"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MobileMockup } from "./MobileMockup";
import { Button } from "@/components/ui/button";
import QRCodeModal from "@/CustomComponents/Popups/QrCode";

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [isQrOpen, setQrOpen] = useState(false);
  const onClose = () => {
    setQrOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-gradient-to-br from-[#02331E] via-[#024029] to-[#02331E]">
      {/* Parallax Background Layers */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-300"
        style={{
          transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0002})`,
          willChange: "transform",
        }}
      >
        {/* Organic shapes in background */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#D4B038] rounded-full mix-blend-overlay blur-3xl opacity-40"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-[#D4B038] rounded-full mix-blend-overlay blur-3xl opacity-30"></div>
      </div>

      {/* Mobile Mockups with Parallax */}
      <div
        className="absolute top-32 -right-16 opacity-50   transition-all duration-300"
        style={{
          transform: `translateY(${scrollY * 0.6}px) rotate(${12 + scrollY * 0.05}deg) scale(${1 + scrollY * 0.0003})`,
          filter: `blur(${Math.max(0, scrollY * 0.01)}px)`,
          willChange: "transform, filter",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.5, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <MobileMockup variant="chat" />
        </motion.div>
      </div>

      <div
        className="absolute bottom-20 -left-20 opacity-50  transition-all duration-300"
        style={{
          transform: `translateY(${scrollY * 0.4}px) rotate(${-15 - scrollY * 0.04}deg) scale(${1 + scrollY * 0.0002})`,
          filter: `blur(${Math.max(0, scrollY * 0.008)}px)`,
          willChange: "transform, filter",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 0.5, x: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <MobileMockup variant="scan" />
        </motion.div>
      </div>

      {/* Mid-layer decorative elements */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      >
        <div className="absolute top-1/3 left-1/4 w-64 h-64 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white/10 rounded-full"></div>
      </div>

      {/* Content Layer */}
      <div className="relative h-full flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl text-white mb-6 tracking-tight">
              Meet your personal
              <br />
              <span className="text-[#D4B038]">lifestyle agent</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto"
          >
            Beauty simplified. Wellness personalized. Confidence amplified.
          </motion.p>
          <QRCodeModal isOpen={isQrOpen} onClose={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              onClick={() => {
                setQrOpen(true);
              }}
              className="bg-[#D4B038] text-[#121212] hover:bg-[#D4B038]/90 px-8 py-6 rounded-full group"
            >
              Get Started
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white/50 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
