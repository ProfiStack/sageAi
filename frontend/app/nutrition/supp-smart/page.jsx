"use client";

import dynamic from "next/dynamic";
import { WebSocketProvider } from "../../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import BeautyQuizPopup from "@/CustomComponents/Popups/QuizzPopup";
import { useEffect, useState } from "react";
import { Api } from "@/shared/api/api";
import useAuthStore from "@/store/authStore";
import { nutritionQuizData } from "@/mockData/quizzMockData";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function SuppSmart() {
  const { token } = useAuthStore();
  const [showBeautyQuiz, setShowBeautyQuiz] = useState(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (token) {
        try {
          const profileData = await Api.client.getProfile(token);
          const hasValidNutritionGoal =
            profileData?.nutrition_goal &&
            profileData.nutrition_goal !== "Unknown";
          const hasValidRestrictions =
            profileData?.dietary_restriction &&
            profileData.dietary_restriction !== "Unknown";

          if (!hasValidRestrictions || !hasValidNutritionGoal) {
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
              const NutritionGoal =
                results?.nutrition_goal && results.nutrition_goal !== "Unknown";
              const Restriction =
                results?.dietary_restriction &&
                results.dietary_restriction !== "Unknown";

              if (!NutritionGoal || !Restriction) {
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
        quizzData={nutritionQuizData}
        title={"Nutrition Analysis"}
      />
      <ProtectedRoute requireAuth={true}>
        <WebSocketProvider route="supp_smart">
          <ConsultationChat
            route="supp_smart"
            title="Supp Smart"
            initialMessage={
              "Confused about supplements? I’ll check if they suit your body and goals and flag any you might want to skip."
            }
          />
        </WebSocketProvider>
      </ProtectedRoute>
    </>
  );
}
