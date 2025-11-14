"use client";

import dynamic from "next/dynamic";
import { WebSocketProvider } from "../../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import BeautyQuizPopup from "@/CustomComponents/Popups/QuizzPopup";
import { useEffect, useState } from "react";
import { Api } from "@/shared/api/api";
import useAuthStore from "@/store/authStore";
import { stylingQuizData } from "@/mockData/quizzMockData";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function FashionFix() {
  const { token } = useAuthStore();
  const [showBeautyQuiz, setShowBeautyQuiz] = useState(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (token) {
        try {
          const profileData = await Api.client.getProfile(token);
          const hasValidStylingPreference =
            profileData?.style_preference &&
            profileData.style_preference !== "Unknown";
          const hasValidStylingGoal =
            profileData?.styling_goal && profileData.styling_goal !== "Unknown";

          if (!hasValidStylingPreference || !hasValidStylingGoal) {
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
              const StylingGoal =
                results?.styling_goal && results.styling_goal !== "Unknown";
              const StylePreference =
                results?.style_preference &&
                results.style_preference !== "Unknown";

              if (!StylingGoal || !StylePreference) {
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
        quizzData={stylingQuizData}
        title={"Style Analysis"}
      />
      <ProtectedRoute requireAuth={true}>
        <WebSocketProvider route="fashion_fix">
          <ConsultationChat
            route="fashion_fix"
            title="Fashion Fix"
            initialMessage={
              "Let’s elevate your style. Share your preferences and I’ll curate looks just for you."
            }
          />
        </WebSocketProvider>
      </ProtectedRoute>
    </>
  );
}
