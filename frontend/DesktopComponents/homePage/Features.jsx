"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Apple, Sparkles, Search, ShieldCheck } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageFallBack";
import { MobileMockup } from "./MobileMockup";

const features = [
  {
    icon: Apple,
    title: "Nutrition & Wellness Guidance",
    description:
      "Personalized nutrition plans, supplement recommendations, and holistic wellness strategies tailored to your unique biology.",
    image:
      "https://images.unsplash.com/photo-1670165088604-5a39f5c1be51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXRyaXRpb24lMjBoZWFsdGh5JTIwbGlmZXN0eWxlfGVufDF8fHx8MTc1OTQyNjk5NXww&ixlib=rb-4.1.0&q=80&w=1080",
    gradient: "from-[#02331E] to-[#024029]",
  },
  {
    icon: Sparkles,
    title: "Skin, Makeup, Hair & Style Consultations",
    description:
      "Expert advice on skincare routines, makeup techniques, hair care, and personal style that enhances your natural beauty.",
    image:
      "https://images.unsplash.com/photo-1590774671735-4d0f6b50edff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtldXAlMjBjb3NtZXRpY3MlMjBlbGVnYW50fGVufDF8fHx8MTc1OTQzMzc2OHww&ixlib=rb-4.1.0&q=80&w=1080",
    gradient: "from-[#D4B038] to-[#b89530]",
  },
  {
    icon: Search,
    title: "Product & Ingredient Checks",
    description:
      "Analyze ingredients, check compatibility with your skin type, and understand what's really in your products.",
    image:
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHdlbGxuZXNzJTIwbWluaW1hbHxlbnwxfHx8fDE3NTk0OTAxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    gradient: "from-[#02331E] to-[#024029]",
  },
  {
    icon: ShieldCheck,
    title: "Fake / Counterfeit Detection",
    description:
      "Protect yourself from counterfeit products with our advanced verification system and authenticity checks.",
    image:
      "https://images.unsplash.com/photo-1712641966973-327ce5829913?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyY2FyZSUyMHN0eWxpbmclMjBtb2Rlcm58ZW58MXx8fHwxNzU5NDkwMTE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    gradient: "from-[#D4B038] to-[#b89530]",
  },
];

export function FeaturesSection() {
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
      id="features"
      ref={sectionRef}
      className="relative py-32 bg-white overflow-hidden"
    >
      {/* Background decorative elements */}
      <div
        className="absolute top-40 left-0 w-80 h-80 bg-[#D4B038] rounded-full mix-blend-multiply opacity-10 blur-3xl transition-all duration-300"
        style={{
          transform: `translateY(${(scrollY - 1400) * 0.15}px) scale(${1 + (scrollY - 1400) * 0.0001})`,
          willChange: "transform",
        }}
      ></div>
      <div
        className="absolute top-1/2 right-0 w-96 h-96 bg-[#02331E] rounded-full mix-blend-multiply opacity-5 blur-3xl transition-all duration-300"
        style={{
          transform: `translateY(${(scrollY - 1600) * -0.12}px) scale(${1 - (scrollY - 1600) * 0.00008})`,
          willChange: "transform",
        }}
      ></div>
      <div
        className="absolute bottom-20 left-1/3 w-72 h-72 bg-[#D4B038] rounded-full mix-blend-multiply opacity-8 blur-3xl transition-all duration-300"
        style={{
          transform: `translateY(${(scrollY - 2000) * 0.18}px) rotate(${(scrollY - 2000) * 0.05}deg)`,
          willChange: "transform",
        }}
      ></div>

      {/* Parallax Mobile Mockups */}
      <div
        className="absolute top-20 right-10 opacity-35  transition-all duration-300"
        style={{
          transform: `translateY(${(scrollY - 1200) * 0.25}px) rotate(${8 + (scrollY - 1200) * 0.008}deg) scale(${1 + (scrollY - 1200) * 0.00008})`,
          filter: `blur(${Math.max(0, (scrollY - 1400) * 0.005)}px)`,
          willChange: "transform, filter",
        }}
      >
        <MobileMockup variant="products" />
      </div>

      <div
        className="absolute bottom-40 left-10 opacity-35  transition-all duration-300"
        style={{
          transform: `translateY(${(scrollY - 1800) * 0.2}px) rotate(${-10 - (scrollY - 1800) * 0.008}deg) scale(${1 - (scrollY - 1800) * 0.00005})`,
          filter: `blur(${Math.max(0, (scrollY - 2000) * 0.005)}px)`,
          willChange: "transform, filter",
        }}
      >
        <MobileMockup variant="profile" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl text-[#02331E] mb-4">
            Core Features
          </h2>
          <p className="text-xl text-[#121212] max-w-2xl mx-auto opacity-80">
            Everything you need for a personalized beauty and wellness journey.
          </p>
        </motion.div>

        <div className="space-y-32">
          {features.map((feature, index) => {
            const baseOffset = 1400 + index * 500;
            const parallaxSpeed = index % 2 === 0 ? 0.08 : -0.06;
            const imageParallax = (scrollY - baseOffset) * 0.05;
            const contentParallax = (scrollY - baseOffset) * parallaxSpeed;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-12 items-center`}
                style={{
                  transform: `translateY(${contentParallax}px)`,
                  willChange: "transform",
                }}
              >
                {/* Image */}
                <div
                  className="w-full md:w-1/2 relative group transition-all duration-300"
                  style={{
                    transform: `translateY(${imageParallax}px) scale(${1 + (scrollY - baseOffset) * 0.00003})`,
                    willChange: "transform",
                  }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${feature.gradient})`,
                    }}
                  ></div>
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    <ImageWithFallback
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10`}
                    ></div>
                  </div>
                </div>

                {/* Content */}
                <div
                  className="w-full md:w-1/2 space-y-6 transition-all duration-300"
                  style={{
                    transform: `translateY(${-imageParallax * 0.5}px)`,
                    willChange: "transform",
                  }}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center transition-all duration-300`}
                    style={{
                      transform: `rotate(${(scrollY - baseOffset) * 0.02}deg) scale(${1 + Math.sin((scrollY - baseOffset) * 0.01) * 0.05})`,
                      willChange: "transform",
                    }}
                  >
                    <feature.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-3xl text-[#02331E]">{feature.title}</h3>
                  <p className="text-lg text-[#121212] leading-relaxed opacity-80">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
