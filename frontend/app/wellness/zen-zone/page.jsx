"use client";

import dynamic from "next/dynamic";
import { WebSocketProvider } from "../../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import { useEffect, useState } from "react";
import BeautyQuizPopup from "@/CustomComponents/Popups/QuizzPopup";
import { Api } from "@/shared/api/api";
import useAuthStore from "@/store/authStore";
import { wellnessQuizData } from "@/mockData/quizzMockData";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function ZenZone() {
  const { token } = useAuthStore();
  const [showBeautyQuiz, setShowBeautyQuiz] = useState(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (token) {
        try {
          const profileData = await Api.client.getProfile(token);
          const hasValidWellnessFocus =
            profileData?.wellness_focus &&
            profileData.wellness_focus !== "Unknown";
          const hasValidTiming =
            profileData?.dedicate_time &&
            profileData.dedicate_time !== "Unknown";

          if (!hasValidWellnessFocus || !hasValidTiming) {
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
        quizzData={wellnessQuizData}
      />
      <ProtectedRoute requireAuth={true}>
        <WebSocketProvider route="zen_zone">
          <ConsultationChat
            route="zen_zone"
            title="Zen Zone"
            initialMessage={
              "Ready to slow down and breathe? I’ll guide you through practices for calm and clarity."
            }
          />
        </WebSocketProvider>
      </ProtectedRoute>
    </>
  );
}
