"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import QRCodeModal from "@/CustomComponents/Popups/QrCode";

export function Navbar({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true);
  const [isQrOpen, setQrOpen] = useState(false);
  const router = useRouter();

  const handleGetStarted = onGetStarted ?? (() => setQrOpen(true));

  const handleB2BRoute = (link) => {
    if (link === "#/b2b") {
      router.push("/b2b");
    }
  };

  const onClose = () => {
    setQrOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    // ✅ Check hash only on client
    if (window.location.pathname.includes("/b2b")) {
      setIsHomePage(false);
    } else {
      setIsHomePage(true);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = isHomePage
    ? [
        { label: "Why SageeAI", href: "#about" },
        { label: "About", href: "/about" },
        { label: "Features", href: "#features" },
        { label: "Coming Soon", href: "#coming-soon" },
        { label: "Mission", href: "#mission" },
        { label: "FAQs", href: "#faq" },
        { label: "B2B", href: "/b2b" },
      ]
    : [{ label: "Home", href: "/" }];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <QRCodeModal isOpen={isQrOpen} onClose={onClose} />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className={cn(
              "relative w-[60px] h-[60px] bg-white rounded-xl",
              scrolled && "bg-transparent"
            )}
          >
            <Image
              src={"/images/sagelogo2.png"}
              objectfit="contain"
              layout="fill"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleB2BRoute(link.href)}
                className={`transition-colors duration-300 hover:text-[#D4B038] ${
                  scrolled ? "text-[#121212]" : "text-white"
                }`}
              >
                {link.label}
              </a>
            ))}

            <button
                onClick={handleGetStarted}
              className="px-6 py-2 bg-[#02331E] text-white rounded-full hover:bg-[#02331E]/90 transition-all duration-300"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            onClick={() => { handleGetStarted(); setMobileMenuOpen(false); }}
            className={`md:hidden transition-colors duration-300 ${
              scrolled ? "text-[#02331E]" : "text-white"
            }`}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[#121212] hover:text-[#D4B038] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {isHomePage && (
                <a
                  href="#cta"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-6 py-2 bg-[#02331E] text-white rounded-full hover:bg-[#02331E]/90 transition-all"
                >
                  Get Started
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
