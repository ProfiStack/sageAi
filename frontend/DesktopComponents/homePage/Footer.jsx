"use client";

import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const footerLinks = {
    Product: [
      { label: "Features", href: "#features" },
      { label: "Coming Soon", href: "#coming-soon" },
      //{ label: "Pricing", href: "#" },
    ],
    Company: [
      { label: "About", href: "#about" },
      //{ label: "Mission", href: "#mission" },
      // { label: "Careers", href: "#" },
    ],
    // Resources: [
    // { label: "Blog", href: "#" },
    //{ label: "Help Center", href: "#" },
    //{ label: "Contact", href: "#" },
    //],
    //Legal: [
    //{ label: "Privacy Policy", href: "#" },
    //{ label: "Terms of Service", href: "#" },
    //{ label: "Cookie Policy", href: "#" },
    //],
  };

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/sagee_ai?igsh=MWZsMXI2M2E5bWJndg==",
      label: "Instagram",
    },
    //{ icon: Twitter, href: "#", label: "Twitter" },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/company/sageeai/",
      label: "LinkedIn",
    },
    {
      icon: Mail,
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=sageeai@sageeai.com",
      label: "Email",
    },
  ];

  return (
    <footer className="bg-[#02331E] text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 space-y-4">
            <div className="relative w-[60px] h-[60px] bg-white rounded-xl">
              <Image
                src={"/images/sagelogo2.png"}
                objectfit="cover"
                layout="fill"
              />
            </div>
            <p className="text-white/70 mb-6">
              Your AI-powered personal lifestyle agent for beauty, wellness, and
              beyond.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4B038] transition-colors duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-[#D4B038]">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60">
              © {new Date().getFullYear()} SageeAI. All rights reserved.
            </p>
            <p className="text-white/60">Made with science, powered by AI.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
