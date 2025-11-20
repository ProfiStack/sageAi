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
export default function HairDecode() {
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
              const hasValidHairType =
                results?.hair_type && results.hair_type !== "Unknown";
              const hasValidConcern =
                results?.hair_concern && results.hair_concern !== "Unknown";

              if (!hasValidHairType || !hasValidConcern) {
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
        quizzData={hairCareQuizData}
        title={"Hair Analysis"}
      />
      <ProtectedRoute requireAuth={true}>
        <WebSocketProvider route="hair_decode">
          <ConsultationChat
            route="hair_decode"
            title="Hair Decode"
            initialMessage={
              "From scalp care to hair health, I’ll give you expert guidance tailored to your hair type and goals"
            }
          />
        </WebSocketProvider>
      </ProtectedRoute>
    </>
  );
}
