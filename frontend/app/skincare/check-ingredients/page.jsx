"use client";
import dynamic from "next/dynamic";
import { WebSocketProvider } from "../../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import BeautyQuizPopup from "@/CustomComponents/Popups/QuizzPopup";
import useAuthStore from "@/store/authStore";
import { useEffect, useState } from "react";
import { Api } from "@/shared/api/api";
import { beautyQuizData } from "@/mockData/quizzMockData";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function CheckIngredients() {
  const { token } = useAuthStore();
  const [showBeautyQuiz, setShowBeautyQuiz] = useState(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (token) {
        try {
          const profileData = await Api.client.getProfile(token);
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
      }
    };

    checkUserProfile();
  }, [token]);
  return (
    <>
      <BeautyQuizPopup
        isOpen={showBeautyQuiz}
        setIsOpen={setShowBeautyQuiz}
        quizzData={beautyQuizData}
        skinTypePopup={true}
      />
      <ProtectedRoute requireAuth={true}>
        <WebSocketProvider route="ingredient_checker">
          <ConsultationChat
            route="ingredient_checker"
            title="Formula Finder"
            initialMessage={
              "Got a product or ingredient in mind? Let’s break it down together. I’ll tell you what’s inside, what it does, and if it’s right for your skin."
            }
          />
        </WebSocketProvider>
      </ProtectedRoute>
    </>
  );
}
