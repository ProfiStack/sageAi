"use client";

import HomePage from "@/CustomComponents/home/Home";
import BeautyQuizPopup from "@/CustomComponents/Popups/QuizzPopup";
import { Api } from "@/shared/api/api";
import useAuthStore from "@/store/authStore";
import { useEffect, useState } from "react";

export default function Home() {
  const { userId } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  const [showBeautyQuiz, setShowBeautyQuiz] = useState(false);

  // Check user profile and determine if beauty quiz is needed
  useEffect(() => {
    setIsMounted(true);
    const checkUserProfile = async () => {
      if (!isMounted) return;
      if (userId) {
        // User is logged in - check their profile
        try {
          const profileData = await Api.client.getProfile(userId);
          // Check if user has skin_type and concern
          const hasValidSkinType =
            profileData?.skin_type && profileData.skin_type !== "Unknown";
          const hasValidConcern =
            profileData?.concern && profileData.concern !== "Unknown";

          if (!hasValidSkinType || !hasValidConcern) {
            setShowBeautyQuiz(true);
          } else {
            console.log("User has complete profile, no quiz needed");
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          // If we can't load profile, show quiz to be safe
          setShowBeautyQuiz(true);
        }
      } else {
        // User is not logged in - check localStorage for guest quiz results
        const guestQuizResults = localStorage.getItem(
          "sagee_guest_quiz_results"
        );

        if (!guestQuizResults) {
          setShowBeautyQuiz(true);
        } else {
          // Guest has completed quiz,
          const results = JSON.parse(guestQuizResults);
        }
      }
    };

    checkUserProfile();
  }, [userId, isMounted]);

  return (
    <>
      <HomePage />
      <BeautyQuizPopup isOpen={showBeautyQuiz} setIsOpen={setShowBeautyQuiz} />
    </>
  );
}
