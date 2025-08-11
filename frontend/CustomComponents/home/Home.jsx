"use client";

import Image from "next/image";
import Footer from "../Footer/Footer";

import { useRouter } from "next/navigation";
import { useAmplitude } from "@/app/providers/amplitudeProvider";
import BeautyQuizPopup from "../Popups/QuizzPopup";
import useAuthStore from "@/store/authStore";
import { useEffect, useState } from "react";
import { Api } from "@/shared/api/api";
import {
  categoryItemsData,
  comingSoonItemsData,
} from "@/mockData/homeMockData";

export default function HomePage() {
  const { token } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState();
  const [showBeautyQuiz, setShowBeautyQuiz] = useState(false);
  const router = useRouter();

  const categoryItems = categoryItemsData;
  const comingSoonItems = comingSoonItemsData;
  const { logEvent } = useAmplitude();
  const handleCategoryClick = (item) => {
    logEvent("Home Section Clicked", {
      click_value: item.title,
    });
    router.push(item.route);
  };

  useEffect(() => {
    const getStaticList = async () => {
      const response = await Api.client.getMessages();
      setMessages(response.message);
      setCurrentMessage(response.message[0].message)
    }

    const checkUserProfile = async () => {
      if (token) {
        try {
          const profileData = await Api.client.getProfile(token);
          console.log(profileData);
          const hasValidSkinType =
            profileData?.skin_type && profileData.skin_type !== "Unknown";
          const hasValidConcern =
            profileData?.concern && profileData.concern !== "Unknown";

          if (!hasValidSkinType || !hasValidConcern) {
            setShowBeautyQuiz(true);
          } else {
            console.log("User has complete profile, no quiz needed");
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          setShowBeautyQuiz(true);
        }
      } else {
        let guestQuizResults = null;
        if (typeof window !== "undefined") {
          guestQuizResults = localStorage.getItem("sagee_guest_quiz_results");
        }

        if (!guestQuizResults) {
          setShowBeautyQuiz(true);
        } else {
          const results = JSON.parse(guestQuizResults);
          // You can use `results` if needed
        }
      }
    };
    getStaticList();
    checkUserProfile();

  }, [token]);
  useEffect(() => {
    if (messages.length) {
      const changeMessage = () => {
        const randomIndex = Math.floor(Math.random() * messages.length);
        setCurrentMessage(messages[randomIndex].message);
      };
      const intervalId = setInterval(changeMessage, 5000); // change every 10 seconds
      return () => clearInterval(intervalId);
    }
  }, [messages])
  return (
    <div className="h-screen bg-gray-50 max-w-md mx-auto flex flex-col justify-between">
      <div className="max-w-md mx-auto bg-white">
        <div className="relative w-[78px] h-[78px] mx-auto">
          <Image
            src={"/images/sagelogo2.png"}
            alt="sage"
            objectFit="contain"
            layout="fill"
          />
        </div>
        <p className="text-2xl font-bold text-center">Welcome to SageeAi</p>
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="mb-8">
            {/* Stats Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl px-2 py-4 border border-emerald-100 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 rounded-full p-1">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-emerald-700 font-medium mb-1">
                    DID YOU KNOW?
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <span className="font-semibold text-emerald-700">{currentMessage?.split('%')[0]}%</span>{" "}
                    {currentMessage?.split('%')[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-8">
            {categoryItems.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 text-gray-700">
                    <category.icon className="w-full h-full" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {category.title}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {category.items.map((item, itemIndex) => {
                    console.log(item.route);
                    return (
                      <button
                        onClick={() => handleCategoryClick(item)}
                        key={itemIndex}
                        className="group bg-white bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10  border border-gray-100 rounded-xl p-2 shadow-lg hover:border-[#D4B038]/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4B038] to-[#f4c842] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                        <div className="w-10 h-10 p-2 mb-3 bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10 rounded-full flex items-center justify-center text-[#D4B038] group-hover:scale-110 transition-transform duration-300">
                          <item.icon className="w-5 h-5" />
                        </div>

                        <div className="text-left">
                          <h3 className="font-semibold text-[#02331E] text-sm leading-tight mb-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-500 leading-tight">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Coming Soon Section */}
            {/* <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Coming Soon</h2>

              <div className="grid grid-cols-2 gap-3">
                {comingSoonItems.map((item, index) => (
                  <button
                    onClick={() => handleCategoryClick(item)}
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 opacity-75 relative overflow-hidden"
                  >
                    <div className="flex flex-col items-start text-left space-y-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 leading-tight block mb-1">
                          {item.title}
                        </span>
                        <p className="text-xs text-gray-400 leading-tight">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <div className="bg-amber-100 text-amber-600 text-xs px-2 py-1 rounded-full font-medium">
                        Soon
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <Footer />
      <BeautyQuizPopup isOpen={showBeautyQuiz} setIsOpen={setShowBeautyQuiz} />
    </div>
  );
}
