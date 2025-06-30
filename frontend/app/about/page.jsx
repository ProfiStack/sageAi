import React from "react";
import { CheckCircle, Shield, Users, Zap, Heart, Star } from "lucide-react";
import Image from "next/image";

export default function AboutUs() {
  const services = [
    {
      icon: <div className="p-2 mt-1 bg-[#D4B038] rounded-full"></div>,
      title: "Skincare",
      description:
        "Get routines based on dermatological science, not TikTok trends",
    },
    {
      icon: <div className="p-2 mt-1 bg-[#D4B038] rounded-full"></div>,
      title: "Haircare",
      description: "Find treatments that work for your hair type and concerns",
    },
    {
      icon: <div className="p-2 mt-1 bg-[#D4B038] rounded-full"></div>,
      title: "Nutrition",
      description: "Separate supplement facts from marketing fiction",
    },
    {
      icon: <div className="p-2 mt-1 bg-[#D4B038] rounded-full"></div>,
      title: "Styling",
      description: "Get advice that suits your lifestyle and budget",
    },
    {
      icon: <div className="p-2 mt-1 bg-[#D4B038] rounded-full"></div>,
      title: "Makeup",
      description:
        "Discover products that work for your skin tone and preferences",
    },
  ];

  const trustFactors = [
    "Peer-reviewed scientific studies",
    "FDA databases and safety information",
    "Expert dermatologist and nutritionist opinions",
    "Real user experiences and clinical data",
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] ">
      <div className="max-w-4xl mx-auto px-6 py-6 ">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-6">
            <Image
              src={"/images/sagelogo.png"}
              alt="logo"
              width={50}
              height={50}
              className="mb-2"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-[#02331E]">
              SAGEEAI
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-[#02331E]/90 font-medium">
            Your personal beauty & wellness truth detective
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-[#F5F5F5]/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl mb-8">
          {/* Problem Statement */}
          <div className="mb-12">
            <p className="text-lg text-[#02331E] mb-6 leading-relaxed">
              Tired of wondering if that viral skincare hack will actually work
              or just break you out? Fed up with conflicting advice about which
              vitamins to take or how to style your hair? You're not alone.
            </p>

            <div className="bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-[#02331E] mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#02331E]" />
                We get it.
              </h3>
              <p className="text-[#02331E] leading-relaxed">
                Every day, you're bombarded with beauty and wellness "advice"
                from influencers, friends, and random internet sources. Half of
                it contradicts the other half, and most of it isn't backed by
                any real science.
              </p>
            </div>

            <p className="text-[#121212] leading-relaxed">
              And let's be honest – not everyone can afford regular trips to
              dermatologists, nutritionists, stylists, or makeup artists.
              Professional guidance shouldn't be a luxury reserved for those who
              can pay hundreds of dollars per consultation.
            </p>
          </div>

          {/* What We Do */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#02331E] mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-[#D4B038]" />
              What We Do
            </h2>
            <p className="text-lg text-[#121212] mb-6 leading-relaxed">
              We built this platform to democratise expert-level beauty and
              wellness guidance. Think of us as your affordable alternative to
              expensive consultations, giving you access to the same quality
              advice you'd get from professionals, without the hefty price tag.
            </p>
            <p className="text-[#121212] leading-relaxed">
              Our AI agent doesn't just recommend products – it verifies claims,
              checks ingredients against scientific research, and gives you
              personalised advice you can trust.
            </p>
          </div>

          {/* Services */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#02331E] mb-8 text-center">
              Here's how we help
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-[#F5F5F5] to-[#F5F5F5]/80 rounded-xl p-6 border border-[#D4B038]/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    {service.icon}
                    <div>
                      <h4 className="font-semibold text-[#02331E] mb-2">
                        {service.title}
                      </h4>
                      <p className="text-[#02331E]/80 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#02331E] mb-6 flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#02331E]" />
              Why Trust Us?
            </h2>
            <p className="text-lg text-[#02331E] mb-6 leading-relaxed">
              Every recommendation goes through our verification process. We
              cross-check claims against:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {trustFactors.map((factor, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-[#F5F5F5] border border-[#b4b3b3] rounded-2xl shadow-2xl p-4"
                >
                  <CheckCircle className="w-5 h-5 text-[#02331E] flex-shrink-0" />
                  <span className="text-[#02331E]">{factor}</span>
                </div>
              ))}
            </div>
            <p className="text-lg text-[#121212] mt-6 leading-relaxed font-medium">
              No more guessing. No more wasted money on products that don't
              work. Just personalised advice backed by real science.
            </p>
          </div>

          {/* Promise */}
          <div className="bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10 rounded-2xl p-8 text-[#02331E]">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Star className="w-6 h-6" />
              Our Promise
            </h2>
            <p className="text-lg leading-relaxed">
              We're here to cut through the noise so you can feel confident
              about your beauty and wellness choices. Whether you're dealing
              with acne, trying to build a sustainable routine, or just want to
              look and feel your best, we've got your back.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
