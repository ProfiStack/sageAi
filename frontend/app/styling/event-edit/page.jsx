"use client";

import dynamic from "next/dynamic";
import { WebSocketProvider } from "../../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import BeautyQuizPopup from "@/CustomComponents/Popups/QuizzPopup";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { Api } from "@/shared/api/api";
import { beautyQuizData, stylingQuizData } from "@/mockData/quizzMockData";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function EventEdit() {
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
        quizzData={stylingQuizData}
      />
      <ProtectedRoute requireAuth={true}>
        <WebSocketProvider route="event_edit">
          <ConsultationChat
            route="event_edit"
            title="Event Edit"
            initialMessage={
              "Got a special event? I’ll curate outfit ideas, accessories, and style tips to make sure you shine."
            }
          />
        </WebSocketProvider>
      </ProtectedRoute>
    </>
  );
}
