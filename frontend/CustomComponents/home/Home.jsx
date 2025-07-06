'use client';

import { mockPageData } from "@/mockData/homeMockData";
import CategoryCard from "./categoryCard/CategoryCard";
import Image from "next/image";
import Footer from "../Footer/Footer";
import { useRouter } from "next/navigation";
import { useAmplitude } from "@/app/providers/amplitudeProvider";
import BeautyQuizPopup from "../Popups/QuizzPopup";
import useAuthStore from "@/store/authStore";
import { useEffect, useState } from "react";
import { Api } from "@/shared/api/api";

const SectionHeader = ({ title }) => (
  <h2 className="text-lg font-bold text-gray-900 mb-4 px-4">{title}</h2>
);

export default function HomePage() {
  const { userId } = useAuthStore();
  const [showBeautyQuiz, setShowBeautyQuiz] = useState(false);
  const router = useRouter();
  const data = mockPageData;
  const { logEvent } = useAmplitude();
  const handleCategoryClick = (item) => {
    logEvent("Home Section Clicked", {
      click_value: item.title,
    });
    router.push(item.route);
  };

  useEffect(() => {
    const checkUserProfile = async () => {
      if (userId) {
        try {
          const profileData = await Api.client.getProfile(userId);
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
          guestQuizResults = localStorage.getItem(
            "sagee_guest_quiz_results"
          );
        }

        if (!guestQuizResults) {
          setShowBeautyQuiz(true);
        } else {
          const results = JSON.parse(guestQuizResults);
          // You can use `results` if needed
        }
      }
    };

    checkUserProfile();
  }, [userId]);

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
        {/* Main Section */}
        <div className="pt-6 pb-4">
          <SectionHeader title="SkinCare" />
          <div className="px-4 space-y-3">
            {data.main.map((item) => (
              <CategoryCard
                key={item.id}
                item={item}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>

        {/* Insights Section */}
        <div className="py-4">
          <SectionHeader title="Insights" />
          <div className="px-4 space-y-3">
            {data.insights.map((item) => (
              <CategoryCard
                key={item.id}
                item={item}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>

        {/* Professional Section */}
        <div className="py-4">
          <SectionHeader title="Professional" />
          <div className="px-4 space-y-3">
            {data.professional.map((item) => (
              <CategoryCard
                key={item.id}
                item={item}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>

        {/* Other Categories Section */}
        <div className="py-4 pb-8">
          <SectionHeader title="Other Categories" />
          <div className="px-4 space-y-3">
            {data.otherCategories.map((item) => (
              <CategoryCard
                key={item.id}
                item={item}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <BeautyQuizPopup isOpen={showBeautyQuiz} setIsOpen={setShowBeautyQuiz} />
    </div>
  );
}
