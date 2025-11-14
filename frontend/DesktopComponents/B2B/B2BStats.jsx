"use client";

import { motion } from "motion/react";
import { ArrowRight, TrendingUp, Users, DollarSign, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import ComingSoonPopup from "../ComingSoon";
import { useState } from "react";

const stats = [
  {
    icon: TrendingUp,
    value: "300%",
    label: "Average Revenue Growth",
    description: "Our clients see 3x revenue increase within the first year",
  },
  {
    icon: Users,
    value: "2M+",
    label: "Daily Analyses",
    description: "Trusted by leading brands processing millions of scans",
  },
  {
    icon: DollarSign,
    value: "90",
    label: "Days to ROI",
    description: "Industry-leading time to return on investment",
  },
  {
    icon: Zap,
    value: "40%",
    label: "Conversion Lift",
    description: "Average increase in purchase conversion rates",
  },
];

export function B2BStats() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#02331E] via-[#02331E]/95 to-[#02331E]/90" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4B038]/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4B038]/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl text-white mb-4">
            Proven Business Impact
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Join industry leaders who are transforming their customer experience
            with SageeAI
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 h-full">
                {/* Icon */}
                <div className="w-14 h-14 bg-[#D4B038] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <stat.icon className="text-[#02331E]" size={28} />
                </div>

                {/* Value */}
                <div className="text-5xl text-[#D4B038] mb-2">{stat.value}</div>

                {/* Label */}
                <h3 className="text-xl text-white mb-3">{stat.label}</h3>

                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed">
                  {stat.description}
                </p>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4B038]/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Case Study Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #D4B038 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
          </div>

          <div className="relative z-10 text-center">
            <div className="inline-block bg-[#D4B038]/20 text-[#D4B038] px-4 py-2 rounded-full text-sm mb-6 border border-[#D4B038]/30">
              Success Story
            </div>

            <h3 className="text-3xl md:text-4xl text-white mb-4">
              "SageeAI helped us increase customer engagement by 340% and reduce
              support costs by 60%"
            </h3>

            <p className="text-xl text-white/80 mb-8">
              — Sarah Chen, VP of Digital Experience at BeautyTech Corp
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => {
                  setIsPopupOpen(true);
                }}
                size="lg"
                className="bg-[#D4B038] hover:bg-[#D4B038]/90 text-[#02331E] px-8 py-6 rounded-full group shadow-[0_10px_40px_rgba(212,176,56,0.4)]"
              >
                Read Case Study
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </Button>
              <Button
                onClick={() => {
                  setIsPopupOpen(true);
                }}
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 bg-white/10 px-8 py-6 rounded-full backdrop-blur-sm"
              >
                Get ROI Calculator
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      <ComingSoonPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        featureName="This feature"
      />
    </section>
  );
}
