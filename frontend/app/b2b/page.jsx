"use client";

import { useState, useEffect, useRef } from "react";

import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/DesktopComponents/homePage/Navbar";
import { B2BHero } from "@/DesktopComponents/B2B/B2BHero";
import { B2BFeatures } from "@/DesktopComponents/B2B/B2BFeatures";
import { B2BStats } from "@/DesktopComponents/B2B/B2BStats";
import { B2BIntegration } from "@/DesktopComponents/B2B/B2BIntegrations";
import { B2BCTA } from "@/DesktopComponents/B2B/B2BCta";
import { Footer } from "@/DesktopComponents/homePage/Footer";
import B2BApi from "@/DesktopComponents/B2B/B2BApi";

export default function B2BPage() {
  const [showBackButton, setShowBackButton] = useState(false);
  const b2bApiRef = useRef(null);

  const scrollToB2BApi = () => {
    b2bApiRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  

  useEffect(() => {
    const handleScroll = () => {
      // Show back button after scrolling past 400px (past the hero section)
      setShowBackButton(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar onGetStarted={scrollToB2BApi} />

      {/* Back Button - Floating (appears after scrolling) */}
      <div
        className={`fixed top-24 right-6 lg:right-8 z-40 transition-all duration-300 ${
          showBackButton
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <a
          href="#/"
          className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-[#02331E] hover:text-[#D4B038] px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all group border border-[#02331E]/10"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Home</span>
        </a>
      </div>

      <main>
        <B2BHero />
        <div ref={b2bApiRef}>
          <B2BApi />
        </div>
        <B2BFeatures />
        <B2BStats />
        <B2BIntegration />
        <B2BCTA />
      </main>

      <Footer />
    </div>
  );
}
