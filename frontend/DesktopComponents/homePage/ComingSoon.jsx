"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, ScanLine } from "lucide-react";

const comingSoonFeatures = [
  {
    icon: ScanLine,
    title: "Image-based mole analysis",
    description:
      "Upload photos to get AI-powered skin health insights and mole monitoring recommendations.",
    color: "#02331E",
  },
  {
    icon: Camera,
    title: "Image-based product analysis",
    description:
      "Snap a photo of any product to instantly analyze ingredients, authenticity, and compatibility.",
    color: "#D4B038",
  },
];

export function ComingSoonSection() {
  const [scrollY, setScrollY] = useState(0);
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

  return (
    <section
      id="coming-soon"
      ref={sectionRef}
      className="relative py-32 bg-gradient-to-br from-[#F5F5F5] to-white overflow-hidden"
    >
      {/* Background decorative elements */}
      <div
        className="absolute bottom-20 right-0 w-96 h-96 bg-[#02331E] rounded-full mix-blend-multiply opacity-5 blur-3xl"
        style={{
          transform: `translateY(${(scrollY - 2800) * 0.1}px)`,
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-[#D4B038]/20 rounded-full mb-6">
            <span className="text-[#02331E]">Coming Soon</span>
          </div>
          <h2 className="text-4xl md:text-5xl text-[#02331E] mb-4">
            The Future of Beauty Tech
          </h2>
          <p className="text-xl text-[#121212] max-w-2xl mx-auto opacity-80">
            Advanced AI-powered visual analysis tools launching soon.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {comingSoonFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl transform group-hover:scale-105 transition-transform duration-500"></div>

              <div className="relative bg-white rounded-3xl p-10 shadow-xl border border-[#02331E]/10 group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Hover reveal effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ backgroundColor: feature.color }}
                ></div>

                {/* Icon */}
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon style={{ color: feature.color }} size={40} />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl text-[#02331E] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#121212] leading-relaxed opacity-80">
                    {feature.description}
                  </p>
                </div>

                {/* Beta badge */}
                <div className="absolute top-6 right-6 px-3 py-1 bg-[#D4B038] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-sm">Beta</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
