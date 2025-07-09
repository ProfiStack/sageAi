"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function AuthInitializer() {
  const { setUserId, userId, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    console.log("AuthInitializer effect running:", { userId });

    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("sagee_user_id");

      // If we don't have a userId in store and no stored ID, create a new guest user
      if (!userId && !storedUserId) {
        setIsAuthenticated(false);
      }
      // If we have a stored ID but no userId in store, use the stored one
      else if (storedUserId && !userId) {
        setUserId(storedUserId);
        console.log("AuthInitializer: Using stored userId:", storedUserId);
      }
      // If we have userId in store but no stored ID, save it to localStorage
      else if (userId && !storedUserId) {
        localStorage.setItem("sagee_user_id", userId);
        console.log("AuthInitializer: Saved userId to localStorage:", userId);
      }
    }
  }, [userId, setUserId]);

  return null;
}
