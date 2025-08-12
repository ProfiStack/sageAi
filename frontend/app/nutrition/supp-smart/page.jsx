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
            profileData?.dietary_restrictions &&
            profileData.dietary_restrictions !== "Unknown";

          if (!hasValidRestrictions || !hasValidNutritionGoal) {
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
        quizzData={nutritionQuizData}
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
