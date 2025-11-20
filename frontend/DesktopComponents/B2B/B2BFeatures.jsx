"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import {
  Shield,
  Users,
  TrendingUp,
  Zap,
  Lock,
  BarChart3,
  Code2,
  Smartphone,
  Globe,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "HIPAA-compliant infrastructure with end-to-end encryption and SOC 2 Type II certification.",
    benefits: [
      "Zero data retention policy",
      "Bank-level encryption",
      "Regular security audits",
      "Compliance reporting",
    ],
    gradient: "from-[#02331E] to-[#02331E]/80",
  },
  {
    icon: Code2,
    title: "Developer-Friendly API",
    description:
      "RESTful API with comprehensive documentation, SDKs, and 99.9% uptime SLA.",
    benefits: [
      "5-minute integration",
      "Real-time webhooks",
      "Sandbox environment",
      "24/7 technical support",
    ],
    gradient: "from-[#D4B038] to-[#D4B038]/80",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Real-time dashboards with customer insights, conversion tracking, and ROI metrics.",
    benefits: [
      "Custom reporting",
      "Predictive analytics",
      "Customer segmentation",
      "Export capabilities",
    ],
    gradient: "from-[#02331E] to-[#D4B038]",
  },
  {
    icon: Users,
    title: "White-Label Solutions",
    description:
      "Fully customizable interface that seamlessly integrates with your brand identity.",
    benefits: [
      "Custom branding",
      "Flexible UI components",
      "Multi-language support",
      "Domain customization",
    ],
    gradient: "from-[#D4B038] to-[#02331E]",
  },
  {
    icon: Smartphone,
    title: "Omnichannel Ready",
    description:
      "Deploy across web, mobile apps, kiosks, and in-store experiences with one API.",
    benefits: [
      "Responsive design",
      "Native SDKs",
      "Offline capability",
      "Cross-platform sync",
    ],
    gradient: "from-[#02331E]/90 to-[#02331E]/70",
  },
  {
    icon: Globe,
    title: "Global Scalability",
    description:
      "Cloud infrastructure designed to handle millions of analyses with low latency worldwide.",
    benefits: [
      "Auto-scaling",
      "CDN distribution",
      "Multi-region hosting",
      "99.99% availability",
    ],
    gradient: "from-[#D4B038]/90 to-[#D4B038]/70",
  },
];

export function B2BFeatures() {
  return (
    <section className="py-24 bg-[#F5F5F5] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#02331E]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4B038]/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl text-[#02331E] mb-4">
            Enterprise-Grade Features
          </h2>
          <p className="text-xl text-[#121212]/70 max-w-3xl mx-auto">
            Everything you need to integrate AI-powered skin analysis into your
            platform
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group h-full bg-white border-2 border-transparent hover:border-[#D4B038]/30 hover:shadow-[0_20px_60px_rgba(2,51,30,0.12)] transition-all duration-300 overflow-hidden">
                {/* Icon Header with Gradient */}
                <div className={`bg-gradient-to-br ${feature.gradient} p-8`}>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="text-white" size={28} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl text-[#02331E] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#121212]/70 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits List */}
                  <ul className="space-y-2.5">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className="text-[#D4B038] flex-shrink-0 mt-0.5"
                          size={18}
                        />
                        <span className="text-[#121212]/80 text-sm">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-16 border-t border-[#02331E]/10"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="text-[#D4B038]" size={24} />
                <div className="text-3xl text-[#02331E]">30s</div>
              </div>
              <p className="text-[#121212]/70">Average Analysis Time</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock className="text-[#02331E]" size={24} />
                <div className="text-3xl text-[#02331E]">100%</div>
              </div>
              <p className="text-[#121212]/70">Privacy Guaranteed</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <BarChart3 className="text-[#D4B038]" size={24} />
                <div className="text-3xl text-[#02331E]">98%</div>
              </div>
              <p className="text-[#121212]/70">Clinical Accuracy</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
