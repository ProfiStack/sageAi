"use client";

import dynamic from "next/dynamic";
import { WebSocketProvider } from "../../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import BeautyQuizPopup from "@/CustomComponents/Popups/QuizzPopup";
import { useEffect, useState } from "react";
import { Api } from "@/shared/api/api";
import useAuthStore from "@/store/authStore";
import { makeupQuizData } from "@/mockData/quizzMockData";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function EventGlam() {
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
        <WebSocketProvider route="event_glam">
          <ConsultationChat
            route="event_glam"
            title="Event Glam"
            initialMessage={
              "Got a big event? Let’s create your perfect look for the day, polished, stunning, and totally you."
            }
          />
        </WebSocketProvider>
      </ProtectedRoute>
    </>
  );
}
