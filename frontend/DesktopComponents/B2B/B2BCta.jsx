"use client";

import { motion } from "motion/react";
import { ArrowRight, Calendar, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import ComingSoonPopup from "../ComingSoon";
import { useState } from "react";

export function B2BCTA() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-br from-[#F5F5F5] via-white to-[#F5F5F5] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#02331E]/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#D4B038]/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl text-[#02331E] mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-[#121212]/70 max-w-3xl mx-auto">
            Join leading brands using SageeAI to deliver personalized skincare
            experiences
          </p>
        </motion.div>

        {/* CTA Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border-2 border-[#02331E]/10 hover:border-[#D4B038]/30 rounded-3xl p-8 hover:shadow-[0_20px_60px_rgba(2,51,30,0.1)] transition-all duration-300 group text-center"
          >
            <div className="w-16 h-16 bg-[#02331E] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="text-white" size={32} />
            </div>
            <h3 className="text-2xl text-[#02331E] mb-3">Book a Demo</h3>
            <p className="text-[#121212]/70 mb-6">
              See SageeAI in action with a personalized walkthrough
            </p>
            <Button
              size="lg"
              onClick={() => {
                setIsPopupOpen(true);
              }}
              className="w-full bg-[#02331E] hover:bg-[#02331E]/90 text-white rounded-full group"
            >
              Schedule Demo
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-[#D4B038] to-[#D4B038]/90 rounded-3xl p-8 shadow-[0_20px_60px_rgba(212,176,56,0.3)] hover:shadow-[0_30px_80px_rgba(212,176,56,0.4)] transition-all duration-300 group text-center relative overflow-hidden"
          >
            {/* Featured Badge */}
            <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm border border-white/30">
              Popular
            </div>

            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <FileText className="text-white" size={32} />
            </div>
            <h3 className="text-2xl text-white mb-3">Get ROI Calculator</h3>
            <p className="text-white/90 mb-6">
              See your potential revenue impact and payback period
            </p>
            <Button
              size="lg"
              onClick={() => {
                setIsPopupOpen(true);
              }}
              className="w-full bg-white hover:bg-white/90 text-[#02331E] rounded-full group"
            >
              Calculate ROI
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white border-2 border-[#02331E]/10 hover:border-[#D4B038]/30 rounded-3xl p-8 hover:shadow-[0_20px_60px_rgba(2,51,30,0.1)] transition-all duration-300 group text-center"
          >
            <div className="w-16 h-16 bg-[#02331E] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Mail className="text-white" size={32} />
            </div>
            <h3 className="text-2xl text-[#02331E] mb-3">Contact Sales</h3>
            <p className="text-[#121212]/70 mb-6">
              Discuss custom pricing and enterprise needs
            </p>
            <Button
              size="lg"
              onClick={() => {
                setIsPopupOpen(true);
              }}
              variant="outline"
              className="w-full border-2 border-[#02331E] text-[#02331E] hover:bg-[#02331E] hover:text-white rounded-full group"
            >
              Get in Touch
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </Button>
          </motion.div>
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-[#121212]/60"
        >
          <p>Free 30-day trial • No credit card required • Cancel anytime</p>
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
