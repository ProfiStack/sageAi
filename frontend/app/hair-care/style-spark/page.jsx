"use client";

import dynamic from "next/dynamic";
import { WebSocketProvider } from "../../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import BeautyQuizPopup from "@/CustomComponents/Popups/QuizzPopup";
import { Api } from "@/shared/api/api";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { hairCareQuizData } from "@/mockData/quizzMockData";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function StyleSpark() {
  const { token } = useAuthStore();
  const [showBeautyQuiz, setShowBeautyQuiz] = useState(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (token) {
        try {
          const profileData = await Api.client.getProfile(token);
          const hasValidHairType =
            profileData?.hair_type && profileData.hair_type !== "Unknown";
          const hasValidHairConcern =
            profileData?.hair_concern && profileData.hair_concern !== "Unknown";

          if (!hasValidHairType || !hasValidHairConcern) {
            setShowBeautyQuiz(true);
          } else {
            console.log("User has complete profile, no quiz needed");
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          setShowBeautyQuiz(true);
        }
      }
    };

    checkUserProfile();
  }, [token]);
  return (
    <>
      <BeautyQuizPopup
        isOpen={showBeautyQuiz}
        setIsOpen={setShowBeautyQuiz}
        quizzData={hairCareQuizData}
      />
      <ProtectedRoute requireAuth={true}>
        <WebSocketProvider route="style_spark">
          <ConsultationChat
            route="style_spark"
            title="Style Spark"
            initialMessage={
              "Need a fresh hairstyle idea? Let’s find the perfect cut or style to match your vibe."
            }
          />
        </WebSocketProvider>
      </ProtectedRoute>
    </>
  );
}
