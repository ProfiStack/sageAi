"use client";

import { useState } from "react";
import {
  Check,
  Search,
  TrendingUp,
  Calendar,
  Eye,
  Tag,
  Shield,
  Zap,
  Users,
  ScanFaceIcon,
} from "lucide-react";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import Image from "next/image";
import Footer from "@/CustomComponents/Footer/Footer";

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState("essential");

  const features = {
    basic: [
      {
        icon: <Users />,
        title: "Skin Consultancy Chat",
        description: "Get personalized advice",
      },
      {
        icon: <TrendingUp />,
        title: "Trend Analysis",
        description: "Stay updated with trends",
      },
      {
        icon: <Search />,
        title: "Check Ingredients",
        description: "Verify product safety",
      },
      {
        icon: <Calendar className="w-5 h-5" />,
        title: "Treatment Planner",
        description: "Plan your skincare routine",
      },
    ],
    essential: [
      {
        icon: <ScanFaceIcon className="w-5 h-5" />,
        title: "Image Analysis",
        description: "AI-powered skin analysis",
      },
      {
        icon: <Eye className="w-5 h-5" />,
        title: "Mole Analysis",
        description: "Monitor skin changes",
      },
      {
        icon: <Tag className="w-5 h-5" />,
        title: "Makeup Category",
        description: "Product categorization",
      },
      {
        icon: <Shield className="w-5 h-5" />,
        title: "Makeup Compatibility Check",
        description: "Find compatible products",
      },
      {
        icon: <Search className="w-5 h-5" />,
        title: "Shade Finder",
        description: "Perfect shade matching",
      },
      {
        icon: <Calendar className="w-5 h-5" />,
        title: "Makeup + Skincare Layering Guide",
        description: "Professional application tips",
      },
      {
        icon: <Zap />,
        title: "Track Makeup's Impact on Your Skin",
        description: "Monitor skin health",
      },
      {
        icon: <Shield />,
        title: "Trend + Technique Validator",
        description: "Verify beauty trends",
      },
      {
        icon: <Search />,
        title: "Brush & Tools Guide",
        description: "Professional tool recommendations",
      },
    ],
  };

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "Free",
      image: "/images/basicSub.png",
      description: "Essential features for skincare enthusiasts",
      popular: false,
    },
    {
      id: "essential",
      name: "Essential",
      price: "£8",
      image: "/images/essential.png",
      description: "Unlock advanced features and personalized insights",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SettingsHeader title={"Subscription Packages"} />

      {/* Main Content */}
      <div className=" mx-auto px-4 py-6">
        {/* Compare Packages Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Compare Packages
          </h2>
          <p className="text-gray-600">
            Choose the plan that best fits your skincare journey
          </p>
        </div>

        {/* Package Cards */}
        <div className="space-y-6 md:space-y-0 md:flex flex-col md:flex-row md:justify-center md:gap-10">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl  p-6 transition-all duration-300 hover:shadow-lg ${
                selectedPlan === plan.id ? "ring-2 ring-emerald-500 " : ""
              }  bg-gradient-to-r from-[#D4B038]/15 to-[#02331E]/15`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald-700 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Package Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xl font-bold text-[#02331E]`}>
                      {plan.name}
                    </h3>
                    <p className={`text-xl font-bold text-[#02331E] `}>
                      {plan.price !== "Free" ? (
                        <span className=" font-bold">{plan.price}/month</span>
                      ) : (
                        `(${plan.price})`
                      )}
                    </p>
                  </div>
                  <p className={`text-sm mb-6 text-[#02331E] opacity-80 mt-2`}>
                    {plan.description}
                  </p>
                </div>
                <div className="relative w-[130px] h-[114px] rounded-[10px]">
                  <Image
                    src={plan.image}
                    fill
                    className="object-cover rounded-[10px]"
                  />
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-6">
                {features[plan.id].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={` p-2 rounded-[8px] ${plan.id === "basic" ? "bg-[#D4B03880]" : "bg-[#D4B03880]"}`}
                    >
                      <div className={`   text-[#02331E] `}>{feature.icon}</div>
                    </div>

                    <div className="flex-1">
                      <h4 className={`font-medium text-[#02331E]`}>
                        {feature.title}
                      </h4>
                      <p className={`text-sm text-[#02331E] opacity-70`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-3 px-4 rounded-xl bg-[#02331E] text-white font-medium transition-all duration-200 ${plan.buttonColor} ${
                  selectedPlan === plan.id ? "transform scale-105" : ""
                }`}
              >
                {plan.id === "basic" ? "Current Plan" : "Upgrade to Essential"}
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
