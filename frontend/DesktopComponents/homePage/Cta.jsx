"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MobileMockup } from "./MobileMockup";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const [scrollY, setScrollY] = useState(0);
  const [email, setEmail] = useState("");
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isInView =
          rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
        setIsVisible(isInView);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle waitlist signup
    console.log("Waitlist signup:", email);
    setEmail("");
  };

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Parallax background layers */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#02331E] via-[#024029] to-[#02331E]"
        style={{
          transform: `translateY(${(scrollY - 3800) * 0.3}px)`,
        }}
      ></div>

      {/* Organic decorative shapes with enhanced layering */}
      <div
        className="absolute top-20 right-20 w-96 h-96 bg-[#D4B038] rounded-full mix-blend-overlay blur-3xl opacity-30 transition-all duration-300"
        style={{
          transform: `translate(${(scrollY - 3800) * -0.1}px, ${(scrollY - 3800) * 0.2}px) scale(${1 + (scrollY - 3800) * 0.00015})`,
          willChange: "transform",
        }}
      ></div>
      <div
        className="absolute bottom-20 left-20 w-80 h-80 bg-[#D4B038] rounded-full mix-blend-overlay blur-3xl opacity-25 transition-all duration-300"
        style={{
          transform: `translate(${(scrollY - 3800) * 0.15}px, ${(scrollY - 3800) * -0.1}px) scale(${1 - (scrollY - 3800) * 0.0001})`,
          willChange: "transform",
        }}
      ></div>

      {/* Additional organic shapes for depth */}
      <div
        className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#F5F5F5] rounded-full mix-blend-overlay blur-3xl opacity-10 transition-all duration-300"
        style={{
          transform: `translate(${(scrollY - 3850) * 0.12}px, ${(scrollY - 3850) * 0.15}px) rotate(${(scrollY - 3850) * 0.08}deg)`,
          willChange: "transform",
        }}
      ></div>
      <div
        className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-gradient-to-br from-[#D4B038]/30 to-[#02331E]/20 rounded-full blur-2xl opacity-40 transition-all duration-300"
        style={{
          transform: `translate(${(scrollY - 3900) * -0.08}px, ${(scrollY - 3900) * 0.12}px) scale(${1 + (scrollY - 3900) * 0.0001})`,
          willChange: "transform",
        }}
      ></div>
      <div
        className="absolute top-1/3 right-1/4 w-56 h-56 bg-gradient-to-br from-[#F5F5F5]/20 to-[#D4B038]/20 rounded-full blur-3xl opacity-30 transition-all duration-300"
        style={{
          transform: `translate(${(scrollY - 3820) * -0.15}px, ${(scrollY - 3820) * -0.1}px)`,
          willChange: "transform",
        }}
      ></div>

      {/* Parallax Mobile Mockups */}
      <div
        className="absolute top-1/4 left-10 opacity-40  transition-all duration-300"
        style={{
          transform: `translateY(${(scrollY - 3600) * 0.22}px) rotate(${-12 - (scrollY - 3600) * 0.01}deg) scale(${1 + (scrollY - 3600) * 0.0001})`,
          filter: `blur(${Math.max(0, (scrollY - 3800) * 0.004)}px)`,
          willChange: "transform, filter",
        }}
      >
        <MobileMockup variant="profile" />
      </div>

      <div
        className="absolute bottom-10 right-10 opacity-40  transition-all duration-300"
        style={{
          transform: `translateY(${(scrollY - 3900) * 0.28}px) rotate(${10 + (scrollY - 3900) * 0.012}deg) scale(${1 + (scrollY - 3900) * 0.00012})`,
          filter: `blur(${Math.max(0, (scrollY - 4100) * 0.004)}px)`,
          willChange: "transform, filter",
        }}
      >
        <MobileMockup variant="scan" />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl mb-6">
            <span className="text-[#D4B038] drop-shadow-[0_4px_20px_rgba(212,176,56,0.6)]">
              Ready to transform your
            </span>
            <br />
            <span className="text-[#02331E] drop-shadow-[0_0_20px_rgba(2,51,30,0.4)]">
              beauty & wellness journey?
            </span>
          </h2>
          <p className="text-xl text-[#121212] mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands who are already experiencing personalized,
            science-backed guidance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto mb-8"
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1 group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#02331E]/60 z-10 transition-colors group-focus-within:text-[#D4B038]"
                size={20}
              />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-6 rounded-full bg-[#F5F5F5] text-[#121212] border-2 border-[#F5F5F5] focus:border-[#D4B038] focus:ring-4 focus:ring-[#D4B038]/20 transition-all shadow-lg hover:shadow-xl"
                required
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-[#D4B038] to-[#b89530] text-[#121212] hover:from-[#b89530] hover:to-[#D4B038] px-8 py-6 rounded-full whitespace-nowrap group shadow-[0_0_30px_rgba(212,176,56,0.4)] hover:shadow-[0_0_40px_rgba(212,176,56,0.6)] transition-all"
            >
              Subscribe for Updates
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </Button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 md:gap-8 text-[#121212]"
        >
          <div className="flex items-center gap-2 group">
            <div className="w-2 h-2 bg-[#D4B038] rounded-full shadow-[0_0_8px_rgba(212,176,56,0.8)] group-hover:scale-125 transition-transform"></div>
            <span className="text-sm md:text-base">
              No credit card required
            </span>
          </div>
          <div className="flex items-center gap-2 group">
            <div className="w-2 h-2 bg-[#D4B038] rounded-full shadow-[0_0_8px_rgba(212,176,56,0.8)] group-hover:scale-125 transition-transform"></div>
            <span className="text-sm md:text-base">Free to start</span>
          </div>
          <div className="flex items-center gap-2 group">
            <div className="w-2 h-2 bg-[#D4B038] rounded-full shadow-[0_0_8px_rgba(212,176,56,0.8)] group-hover:scale-125 transition-transform"></div>
            <span className="text-sm md:text-base">Cancel anytime</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
