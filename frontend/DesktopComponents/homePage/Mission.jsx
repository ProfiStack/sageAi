"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { MobileMockup } from "./MobileMockup";

const testimonials = [
  {
    quote: "Finally, someone who speaks science, not sales.",
    author: "Sarah M.",
  },
  {
    quote: "Reduced my beauty spending by 40% and got better results.",
    author: "Jessica L.",
  },
  {
    quote: "Like having a dermatologist and nutritionist in my pocket.",
    author: "Michael R.",
  },
];

export function MissionSection() {
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
      id="mission"
      ref={sectionRef}
      className="relative py-32 bg-white overflow-hidden"
    >
      {/* Background decorative elements with parallax */}
      <div
        className="absolute top-20 left-10 w-72 h-72 bg-[#D4B038] rounded-full mix-blend-multiply opacity-5 blur-3xl"
        style={{
          transform: `translate(${(scrollY - 3200) * 0.05}px, ${(scrollY - 3200) * 0.1}px)`,
        }}
      ></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-[#02331E] rounded-full mix-blend-multiply opacity-5 blur-3xl"
        style={{
          transform: `translate(${(scrollY - 3200) * -0.05}px, ${(scrollY - 3200) * 0.08}px)`,
        }}
      ></div>

      {/* Parallax Mobile Mockup */}
      <div
        className="absolute top-1/2 -translate-y-1/2 right-0 opacity-40  transition-all duration-300"
        style={{
          transform: `translateY(${(scrollY - 3000) * 0.18}px) rotate(${15 + (scrollY - 3000) * 0.01}deg) scale(${1 + (scrollY - 3000) * 0.00008})`,
          filter: `blur(${Math.max(0, (scrollY - 3200) * 0.003)}px)`,
          willChange: "transform, filter",
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
          <h2 className="text-4xl md:text-5xl text-[#02331E] mb-8">
            Our Mission & Impact
          </h2>
          <p className="text-2xl md:text-3xl text-[#121212] max-w-4xl mx-auto leading-relaxed opacity-85">
            Cutting waste, reducing returns, making expert advice accessible
            worldwide.
          </p>
        </motion.div>

        {/* Mission Statement Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="bg-gradient-to-br from-[#02331E] to-[#024029] rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4B038] rounded-full blur-3xl opacity-10"></div>
            <div className="relative z-10">
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
                We believe everyone deserves access to personalized,
                science-backed beauty and wellness guidance. No more confusion,
                no more waste, no more fake products. Just honest, expert advice
                that empowers you to make informed decisions about your health
                and beauty.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-1 w-20 bg-[#D4B038]"></div>
                <p className="text-[#D4B038]">
                  Join us in revolutionizing personal care.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonial Bubbles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="relative"
              style={{
                transform: isVisible
                  ? `translateY(${index * 10}px)`
                  : "translateY(30px)",
              }}
            >
              <div className="bg-[#F5F5F5] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#02331E]/5">
                <Quote className="text-[#D4B038] mb-4" size={32} />
                <p className="text-[#121212] mb-4 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <p className="text-[#02331E]">— {testimonial.author}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
