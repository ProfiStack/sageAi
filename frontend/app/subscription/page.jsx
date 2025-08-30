"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Scissors,
  Shirt,
  Heart,
  Apple,
  Palette,
  MessageCircle,
  Beaker,
  Droplets,
  ScanFace,
} from "lucide-react";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import Image from "next/image";
import Footer from "@/CustomComponents/Footer/Footer";
import useAuthStore from "@/store/authStore";
import CancelSubscriptionPopup from "@/CustomComponents/Popups/CancelSubscription";
import SubscribeButton from "@/CustomComponents/button/Subscribe";
import { Api } from "@/shared/api/api";

export default function SubscriptionPage() {
  const [open, setisOpen] = useState(false);
  const [price, setPrice] = useState({ usd: null, gbp: null });
  const [selectedPlan, setSelectedPlan] = useState("essential");
  useEffect(() => {
    const fetchPrices = async () => {
      const response = await Api.client.prices();
      setPrice(response);
    };
    fetchPrices();
  }, []);

  const features = {
    basic: [
      {
        icon: <MessageCircle className="w-5 h-5" />,
        title: "Skin Consultancy Chat",
        description: "Get personalized skincare advice and solutions",
      },
      {
        icon: <Palette className="w-5 h-5" />,
        title: "Makeup Consultancy Chat",
        description: "Expert makeup tips and product recommendations",
      },
      {
        icon: <Apple className="w-5 h-5" />,
        title: "Nutrition Consultancy Chat",
        description: "Nutrition guidance for healthy skin and wellness",
      },
      {
        icon: <Scissors className="w-5 h-5" />,
        title: "Hair Care Consultancy Chat",
        description: "Professional hair care advice and treatments",
      },
      {
        icon: <Shirt className="w-5 h-5" />,
        title: "Styling Consultancy Chat",
        description: "Personal styling and fashion recommendations",
      },
      {
        icon: <Heart className="w-5 h-5" />,
        title: "Wellness Consultancy Chat",
        description: "Holistic wellness and lifestyle guidance",
      },
    ],
    essential: [
      {
        icon: <ScanFace className="w-5 h-5" />,
        title: "Skin Analysis",
        description: "AI-powered skin analysis of image",
      },
      {
        icon: <Droplets className="w-5 h-5" />,
        title: "Shade Matching",
        description: "AI-Powered Matching Shade for your skin",
      },
      {
        icon: <Eye className="w-5 h-5" />,
        title: "Mole Analysis",
        description: "AI-Powered Mole Analysis coming soon",
      },
      {
        icon: <Beaker className="w-5 h-5" />,
        title: "Product Analysis",
        description: "AI-Powered Product Analysis coming soon",
      },
      {
        icon: <MessageCircle className="w-5 h-5" />,
        title: "Skin Consultancy Chat",
        description: "Get personalized skincare advice and solutions",
      },
      {
        icon: <Palette className="w-5 h-5" />,
        title: "Makeup Consultancy Chat",
        description: "Expert makeup tips and product recommendations",
      },
      {
        icon: <Apple className="w-5 h-5" />,
        title: "Nutrition Consultancy Chat",
        description: "Nutrition guidance for healthy skin and wellness",
      },
      {
        icon: <Scissors className="w-5 h-5" />,
        title: "Hair Care Consultancy Chat",
        description: "Professional hair care advice and treatments",
      },
      {
        icon: <Shirt className="w-5 h-5" />,
        title: "Styling Consultancy Chat",
        description: "Personal styling and fashion recommendations",
      },
      {
        icon: <Heart className="w-5 h-5" />,
        title: "Wellness Consultancy Chat",
        description: "Holistic wellness and lifestyle guidance",
      },
    ],
  };

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "Free",
      image: "/images/basicSub.png",
      description: "Essential features for balancing lifestyle",
      popular: false,
    },
    {
      id: "essential",
      name: "Essential",
      price: price,
      image: "/images/essential.png",
      description: "Unlock advanced features and personalized insights",
      popular: true,
    },
  ];

  const { isSubscribed } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SettingsHeader title={"Subscription Packages"} />

      {/* Main Content */}
      <div className=" mx-auto px-4 py-6">
        {/* Compare Packages Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Packages</h2>
          <p className="text-gray-600">
            Choose the plan that best fits your Life Style
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
                  <div className="flex items-start gap-2">
                    <h3
                      className={`text-xl leading-none font-semibold text-[#02331E]`}
                    >
                      {plan.name}
                    </h3>
                    <div className={` text-[#02331E] leading-none `}>
                      {plan.price !== "Free" ? (
                        <span className=" font-semibold leading-none">
                          {" "}
                          {price.usd && `${price.usd.toFixed(0)} USD`}{" "}
                          {price.gbp && ` or ${price.gbp} GBP`} per month
                        </span>
                      ) : (
                        <p className="text-xl font-semibold leading-none">
                          {" "}
                          {plan.price}
                        </p>
                      )}
                    </div>
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

              {/* Action Button */}
              {!isSubscribed && plan.id === "essential" ? (
                <SubscribeButton>
                  <div
                    className={`w-full py-3 px-4 rounded-xl bg-[#02331E] text-white font-medium transition-all duration-200 ${plan.buttonColor} ${
                      selectedPlan === plan.id ? "transform scale-105" : ""
                    } text-center`}
                  >
                    Upgrade to Essential
                  </div>
                </SubscribeButton>
              ) : (
                <button
                  onClick={() => {
                    if (isSubscribed && plan.id === "basic") {
                      setisOpen(true);
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-xl bg-[#02331E] text-white font-medium transition-all duration-200 ${plan.buttonColor} ${
                    selectedPlan === plan.id ? "transform scale-105" : ""
                  }`}
                >
                  {isSubscribed
                    ? plan.id === "essential"
                      ? "Current Plan"
                      : "Downgrade to Basic"
                    : "Current Plan"}
                </button>
              )}

              {isSubscribed && plan.id === "essential" && (
                <button
                  onClick={() => setisOpen(true)}
                  className="w-full mt-3 py-3 px-4 rounded-xl text-red-700 font-medium transition-all duration-200 flex justify-center underline underline-offset-4"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <CancelSubscriptionPopup isOpen={open} setIsOpen={setisOpen} />
      <Footer />
    </div>
  );
}
