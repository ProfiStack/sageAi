"use client";

import dynamic from "next/dynamic";
import { WebSocketProvider } from "../../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import BeautyQuizPopup from "@/CustomComponents/Popups/QuizzPopup";
import { Api } from "@/shared/api/api";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { wellnessQuizData } from "@/mockData/quizzMockData";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function ManifistMode() {
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
              const WellnessFocus =
                results?.wellness_focus && results.wellness_focus !== "Unknown";
              const DedicateTime =
                results?.dedicate_time && results.dedicate_time !== "Unknown";

              if (!WellnessFocus || !DedicateTime) {
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
        quizzData={wellnessQuizData}
        title={"Wellness Analysis"}
      />
      <ProtectedRoute requireAuth={true}>
        <WebSocketProvider route="manifest_mode">
          <ConsultationChat
            route="manifest_mode"
            title="Manifest Mode"
            initialMessage={
              "Ready to call in your dreams? Let’s set clear intentions and align your energy to make them real."
            }
          />
        </WebSocketProvider>
      </ProtectedRoute>
    </>
  );
}
