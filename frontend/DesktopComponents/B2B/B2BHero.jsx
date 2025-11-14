"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import ComingSoonPopup from "../ComingSoon";
import { useState } from "react";

export function B2BHero() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#02331E] via-[#02331E]/95 to-[#02331E]/90">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-[#D4B038] rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#D4B038]/40 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-[#D4B038]/20 text-[#D4B038] px-4 py-2 rounded-full mb-6 border border-[#D4B038]/30"
            >
              <Sparkles size={16} />
              <span className="text-sm">Enterprise AI Solutions</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl text-white mb-6 leading-tight">
              Transform Your Business with{" "}
              <span className="text-[#D4B038]">AI-Powered Skin Analysis</span>
            </h1>

            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Integrate our enterprise-grade AI platform to deliver personalized
              skincare experiences at scale. Drive engagement, increase
              conversions, and build lasting customer relationships.
            </p>

            {/* Key Benefits */}
            <div className="space-y-3 mb-8">
              {[
                "Increase customer engagement by 300%",
                "98% accuracy with medical-grade analysis",
                "ROI within 90 days guaranteed",
                "HIPAA-compliant & privacy-first",
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2
                    className="text-[#D4B038] flex-shrink-0"
                    size={20}
                  />
                  <span className="text-white/90">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                onClick={() => {
                  setIsPopupOpen(true);
                }}
                className="bg-[#D4B038] hover:bg-[#D4B038]/90 text-[#02331E] px-8 py-6 rounded-full group shadow-[0_10px_40px_rgba(212,176,56,0.4)] hover:shadow-[0_15px_50px_rgba(212,176,56,0.6)] transition-all"
              >
                Book a Demo
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  setIsPopupOpen(true);
                }}
                variant="outline"
                className="border-2 border-white/30 text-white bg-white/10 hover:bg-white/10 px-8 py-6 rounded-full backdrop-blur-sm"
              >
                View Pricing
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Mobile Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center items-center"
          >
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-[280px] md:w-[320px] h-[580px] md:h-[640px] bg-[#1a1a1a] rounded-[3rem] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
                {/* Screen */}
                <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/20 to-transparent z-20 flex items-center justify-between px-6 pt-2">
                    <div className="text-xs text-white">9:41</div>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Face Image */}
                  <img
                    src="https://images.unsplash.com/photo-1679517354337-6037a4cdeda1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhY2UlMjBza2luY2FyZSUyMGNsb3NlfGVufDF8fHx8MTc2MDAzMTk3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="AI Skin Analysis"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Scanning Overlay */}
                  <motion.div
                    animate={{
                      top: ["10%", "90%", "10%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute left-0 right-0 h-1 bg-[#D4B038] shadow-[0_0_20px_rgba(212,176,56,0.8)] z-10"
                  />

                  {/* AI Analysis Points */}
                  {[
                    { top: "25%", left: "30%", delay: 0 },
                    { top: "35%", left: "70%", delay: 0.2 },
                    { top: "50%", left: "50%", delay: 0.4 },
                    { top: "65%", left: "35%", delay: 0.6 },
                    { top: "45%", left: "80%", delay: 0.8 },
                  ].map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 1],
                        opacity: [0, 1, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: point.delay,
                      }}
                      className="absolute z-10"
                      style={{ top: point.top, left: point.left }}
                    >
                      <div className="relative">
                        <div className="w-3 h-3 bg-[#D4B038] rounded-full"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-[#D4B038] rounded-full animate-ping"></div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Analysis Card */}
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="absolute bottom-6 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl z-20"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#02331E] rounded-full flex items-center justify-center">
                        <Sparkles className="text-[#D4B038]" size={20} />
                      </div>
                      <div>
                        <div className="text-[#02331E] text-sm">
                          AI Analysis Complete
                        </div>
                        <div className="text-[#D4B038] text-xs">
                          98% Accuracy
                        </div>
                      </div>
                    </div>

                    {/* Mini Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      {["Hydration", "Texture", "Clarity"].map((label, i) => (
                        <div key={i} className="bg-[#F5F5F5] rounded-lg p-2">
                          <div className="text-[#02331E] text-xs">{label}</div>
                          <div className="text-[#D4B038] text-lg">
                            {85 + i * 5}%
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Progress Indicator */}
                    <motion.div className="mt-3 h-1 bg-[#F5F5F5] rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: ["0%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-full bg-gradient-to-r from-[#02331E] to-[#D4B038]"
                      />
                    </motion.div>
                  </motion.div>

                  {/* Top Header */}
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="absolute top-14 left-4 right-4 z-20"
                  >
                    <div className="bg-[#02331E]/90 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Sparkles size={16} className="text-[#D4B038]" />
                      </motion.div>
                      Analyzing Skin...
                    </div>
                  </motion.div>
                </div>

                {/* Phone Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1a1a] rounded-b-2xl z-30"></div>
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-6 -right-6 bg-[#D4B038] text-[#02331E] px-6 py-3 rounded-full shadow-lg z-30"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <span className="text-sm">Real-time AI</span>
                </div>
              </motion.div>

              {/* Decorative Glow */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#D4B038]/30 rounded-3xl blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-[1px]">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F5F5F5"
          />
        </svg>
      </div>
      <ComingSoonPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        featureName="This feature"
      />
    </section>
  );
}
