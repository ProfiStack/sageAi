"use client";

import dynamic from "next/dynamic";
import { WebSocketProvider } from "../../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import BeautyQuizPopup from "@/CustomComponents/Popups/QuizzPopup";
import { Api } from "@/shared/api/api";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { makeupQuizData } from "@/mockData/quizzMockData";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function FlawlessFactor() {
  const { token } = useAuthStore();
  const [showBeautyQuiz, setShowBeautyQuiz] = useState(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (token) {
        try {
          const profileData = await Api.client.getProfile(token);
          const hasValidSkinType =
            profileData?.skin_type && profileData.skin_type !== "Unknown";
          const hasValidGoal =
            profileData?.makeup_goal && profileData.makeup_goal !== "Unknown";

          if (!hasValidSkinType || !hasValidGoal) {
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
              const makeupGoal =
                results?.makeup_goal && results.makeup_goal !== "Unknown";

              if (!hasValidSkinType || !makeupGoal) {
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
        quizzData={makeupQuizData}
        skinTypePopup={true}
        title={"Makeup Analysis"}
      />
      <ProtectedRoute requireAuth={true}>
        <WebSocketProvider route="flawless_factor">
          <ConsultationChat
            route="flawless_factor"
            title="Flawless Factor"
            initialMessage={
              "Want to perfect your makeup technique? Share what you do, and I’ll guide you on tweaks for a flawless finish."
            }
          />
        </WebSocketProvider>
      </ProtectedRoute>
    </>
  );
}
