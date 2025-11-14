"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Microscope, Shield, Lightbulb } from "lucide-react";
import { MobileMockup } from "./MobileMockup";

const features = [
  {
    icon: Microscope,
    title: "Science-backed",
    description:
      "Every recommendation powered by research, dermatology, and nutrition science.",
  },
  {
    icon: Shield,
    title: "No hype, no waste",
    description:
      "Cut through marketing noise. Get honest advice on what works for you.",
  },
  {
    icon: Lightbulb,
    title: "Clarity not confusion",
    description:
      "Simple, personalized guidance that fits your unique needs and goals.",
  },
];

export function AboutSection() {
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
      id="about"
      ref={sectionRef}
      className="relative py-32 bg-[#F5F5F5] overflow-hidden"
    >
      {/* Background decorative element */}
      <div
        className="absolute top-20 right-0 w-96 h-96 bg-[#02331E] rounded-full mix-blend-multiply opacity-5 blur-3xl"
        style={{
          transform: `translateY(${(scrollY - 800) * 0.2}px)`,
        }}
      ></div>

      {/* Parallax Mobile Mockup */}
      <div
        className="absolute bottom-20 -left-10 opacity-40 hidden lg:block transition-all duration-300"
        style={{
          transform: `translateY(${(scrollY - 700) * 0.3}px) rotate(${-8 + (scrollY - 700) * 0.01}deg) scale(${1 + (scrollY - 700) * 0.0001})`,
          willChange: "transform",
        }}
      >
        <MobileMockup variant="chat" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl text-[#02331E] mb-4">
            Why SageeAI?
          </h2>
          <p className="text-xl text-[#121212] max-w-2xl mx-auto opacity-80">
            Your trusted companion in navigating the complex world of beauty and
            wellness.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 h-full border border-[#02331E]/5">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-[#02331E] to-[#024029] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="text-[#D4B038]" size={32} />
                </div>

                {/* Content */}
                <h3 className="text-2xl text-[#02331E] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#121212] leading-relaxed opacity-80">
                  {feature.description}
                </p>

                {/* Decorative element */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-[#D4B038] rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
