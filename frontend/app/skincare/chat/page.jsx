"use client";
import dynamic from "next/dynamic";
import { WebSocketProvider } from "../../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import { useEffect, useState } from "react";
import { Api } from "@/shared/api/api";
import useAuthStore from "@/store/authStore";
import BeautyQuizPopup from "@/CustomComponents/Popups/QuizzPopup";
import { beautyQuizData } from "@/mockData/quizzMockData";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});

export default function Chat() {
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
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          setShowBeautyQuiz(true);
        }
      } else {
        // Guest user - check localStorage for specific keys
        if (typeof window !== "undefined") {
          const guestQuizResults = localStorage.getItem(
            "sagee_guest_quiz_results"
          );

          if (!guestQuizResults) {
            // No quiz results saved - show the quiz
            setShowBeautyQuiz(true);
          } else {
            try {
              const results = JSON.parse(guestQuizResults);

              // Check for skin_type and concern (required for skincare page)
              const hasValidSkinType =
                results?.skin_type && results.skin_type !== "Unknown";
              const hasValidConcern =
                results?.concern && results.concern !== "Unknown";

              if (!hasValidSkinType || !hasValidConcern) {
                setShowBeautyQuiz(true);
              }
            } catch (error) {
              console.error("Error parsing guest quiz results:", error);
              setShowBeautyQuiz(true);
            }
          }
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
        title={"Skin Analysis"}
      />

      <WebSocketProvider route="skincare">
        <ConsultationChat
          route="skincare"
          title="Derm Direct"
          initialMessage="Hi! I’m your personal skin consultant. Share your skin concerns and goals, and I’ll guide you with expert advice tailored just for you."
        />
      </WebSocketProvider>
    </>
  );
}
