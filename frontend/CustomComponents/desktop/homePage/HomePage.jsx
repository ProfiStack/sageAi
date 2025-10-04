"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Bot, ArrowRight, Users, Target } from "lucide-react";
import Image from "next/image";
import QRCodeModal from "@/CustomComponents/Popups/QrCode";
import { useRouter } from "next/navigation";

import ComingSoon from "@/CustomComponents/desktop/ComingSoon";
import Categories from "@/CustomComponents/desktop/Categories";
import Features from "@/CustomComponents/desktop/Features";

const DesktopHomePage = () => {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const router = useRouter();

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const hoverScale = {
    scale: 1.05,
    transition: { duration: 0.3 },
  };

  const hoverGlow = {
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(212, 176, 56, 0.3)",
    transition: { duration: 0.3 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10">
      <QRCodeModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/90 border-b border-[#02331E]/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-8 h-8">
                <Image
                  src="/images/sagelogo.png"
                  objectFit="contain"
                  layout="fill"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#02331E] to-[#D4B038] bg-clip-text text-transparent">
                SageeAI
              </span>
            </motion.div>

            <motion.div
              className="hidden md:flex space-x-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {["Features", "Categories", "Coming Soon", "About Us"].map(
                (item) => (
                  <motion.button
                    key={item}
                    onClick={() => {
                      if (item === "About Us") {
                        router.push("/about");
                      } else {
                        const section = document.getElementById(
                          item.toLowerCase().replace(" ", "-")
                        );
                        if (section) {
                          section.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }
                    }}
                    className="text-[#02331E] hover:text-[#D4B038] transition-colors font-medium cursor-pointer bg-transparent border-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </motion.button>
                )
              )}
            </motion.div>

            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button
                onClick={() => setQrModalOpen(true)}
                className="text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 font-medium bg-gradient-to-r from-[#02331E] to-[#D4B038]"
                whileHover={hoverGlow}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-[#D4B038]/30 rounded-full px-4 py-2 mb-8"
                {...scaleIn}
                transition={{ delay: 0.2 }}
              >
                <Bot className="w-5 h-5 text-[#02331E]" />
                <span className="text-[#02331E] font-medium">
                  AI-Powered Lifestyle Revolution
                </span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-[#D4B038]" />
                </motion.div>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                {...fadeInUp}
                transition={{ delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-[#02331E] via-[#D4B038] to-[#02331E] bg-clip-text text-transparent">
                  Transform Your LifeStyle
                </span>
                <br />
                <span className="text-[#02331E]">Journey with AI</span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
                {...fadeInUp}
                transition={{ delay: 0.4 }}
              >
                Experience personalized skincare, makeup, nutrition, haircare
                and wellness recommendations powered by advanced AI technology.
                Your lifestyle evolution starts here.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                {...fadeInUp}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  onClick={() => setQrModalOpen(true)}
                  className="bg-gradient-to-r from-[#02331E] to-[#D4B038] text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                  whileHover={hoverScale}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Start Your Journey</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { number: "600+", label: "Users", icon: Users },
              { number: "27", label: "AI-Powered Tools", icon: Bot },
              { number: "98%", label: "Accuracy Rate", icon: Target },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center hover:shadow-xl hover:bg-white/80 transition-all duration-300 border border-[#D4B038]/20"
                variants={staggerItem}
                whileHover={hoverScale}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-[#02331E] to-[#D4B038] rounded-2xl flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>
                <motion.div
                  className="text-4xl font-bold text-[#02331E] mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Categories Section */}
      <Categories />

      {/* Coming Soon Section */}
      <ComingSoon />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#02331E] via-[#02331E]/90 to-[#D4B038]">
        <motion.div
          className="max-w-4xl mx-auto text-center text-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your LifeStyle Journey?
          </motion.h2>
          <motion.p
            className="text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.9 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Join thousands of users who have discovered the power of AI-driven
            lifestyle solutions.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.button
              onClick={() => setQrModalOpen(true)}
              className="bg-white text-[#02331E] px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              variants={staggerItem}
              whileHover={hoverScale}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Free Trial</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            </motion.button>
            <motion.button
              onClick={() => router.push("/about")}
              className="border-2 border-white/80 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              variants={staggerItem}
              whileHover={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="max-w-7xl mx-auto mt-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-8 h-8 bg-white rounded-xl">
                <Image
                  src="/images/sagelogo.png"
                  objectFit="contain"
                  layout="fill"
                />
              </div>
              <span className="text-2xl font-bold text-white">SageeAI</span>
            </motion.div>
            <div className="text-white/70 text-center md:text-right">
              © 2024 SageeAI. Revolutionizing lifestyle with AI.
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default DesktopHomePage;
