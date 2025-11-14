"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { ArrowRight, Code2, Puzzle, Rocket, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ComingSoonPopup from "../ComingSoon";
import { useState } from "react";

const integrationSteps = [
  {
    icon: Code2,
    title: "Get Your API Key",
    description:
      "Sign up and receive instant access to your sandbox environment",
    time: "2 minutes",
  },
  {
    icon: Puzzle,
    title: "Integrate SDK",
    description: "Use our pre-built SDKs for React, iOS, Android, or REST API",
    time: "15 minutes",
  },
  {
    icon: Rocket,
    title: "Go Live",
    description: "Deploy to production and start analyzing skin instantly",
    time: "1 hour",
  },
];

const platforms = [
  { name: "React", logo: "⚛️" },
  { name: "iOS", logo: "🍎" },
  { name: "Android", logo: "🤖" },
  { name: "Vue", logo: "💚" },
  { name: "Angular", logo: "🅰️" },
  { name: "REST API", logo: "🔌" },
];

export function B2BIntegration() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4B038]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#02331E]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl text-[#02331E] mb-4">
            Integration Made Simple
          </h2>
          <p className="text-xl text-[#121212]/70 max-w-3xl mx-auto">
            Get up and running in minutes with our developer-friendly API and
            comprehensive documentation
          </p>
        </motion.div>

        {/* Integration Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {integrationSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connection Line */}
              {index < integrationSteps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-[#D4B038] to-transparent -translate-x-1/2 z-0" />
              )}

              <Card className="relative z-10 p-8 bg-gradient-to-br from-[#F5F5F5] to-white border-2 border-[#02331E]/10 hover:border-[#D4B038]/30 hover:shadow-[0_20px_60px_rgba(2,51,30,0.1)] transition-all duration-300 group h-full">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#D4B038] text-[#02331E] rounded-full flex items-center justify-center shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-[#02331E] to-[#02331E]/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="text-white" size={32} />
                </div>

                {/* Time Badge */}
                <div className="inline-block bg-[#D4B038]/10 text-[#D4B038] px-3 py-1 rounded-full text-sm mb-4">
                  {step.time}
                </div>

                <h3 className="text-2xl text-[#02331E] mb-3">{step.title}</h3>
                <p className="text-[#121212]/70 leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Code Example */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-16"
        >
          {/* Left - Code Block */}
          <div className="relative">
            <div className="bg-[#02331E] rounded-2xl p-8 shadow-[0_20px_60px_rgba(2,51,30,0.2)] border border-[#D4B038]/20">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-white/60 text-sm">app.tsx</span>
              </div>
              <pre className="text-sm text-[#D4B038] overflow-x-auto">
                <code>{`import { SageeAI } from '@sageeai/sdk';

const sageeai = new SageeAI({
  apiKey: 'your_api_key'
});

const result = await sageeai.analyze({
  image: userPhoto,
  analysis: ['skin_type', 'concerns']
});

// Get personalized recommendations
console.log(result.recommendations);`}</code>
              </pre>
            </div>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4B038]/20 to-[#02331E]/20 rounded-2xl blur-2xl -z-10" />
          </div>

          {/* Right - Features */}
          <div>
            <h3 className="text-3xl text-[#02331E] mb-6">
              Developer Experience First
            </h3>
            <div className="space-y-4 mb-8">
              {[
                "Comprehensive API documentation",
                "Interactive sandbox environment",
                "Pre-built UI components",
                "Real-time webhook notifications",
                "Detailed error messages",
                "Code examples in 10+ languages",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2
                    className="text-[#D4B038] flex-shrink-0"
                    size={20}
                  />
                  <span className="text-[#121212]/80">{feature}</span>
                </motion.div>
              ))}
            </div>
            <Button
              onClick={() => {
                setIsPopupOpen(true);
              }}
              size="lg"
              className="bg-[#02331E] hover:bg-[#02331E]/90 text-white px-8 py-6 rounded-full group"
            >
              View Documentation
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </Button>
          </div>
        </motion.div>

        {/* Platform Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-[#121212]/60 mb-6">
            Supports all major platforms and frameworks
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {platforms.map((platform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="bg-white border-2 border-[#02331E]/10 hover:border-[#D4B038]/30 rounded-2xl px-6 py-4 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {platform.logo}
                </div>
                <div className="text-sm text-[#121212]/70">{platform.name}</div>
              </motion.div>
            ))}
          </div>
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
