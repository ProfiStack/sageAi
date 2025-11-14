"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function AuthInitializer() {
  const { setUserId, userId } = useAuthStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("sagee_user_id");

      // If we don't have a userId in store and no stored ID, create a new guest user
      if (!userId && !storedUserId) {
        const newGuestId = `user-${Date.now()}`;
        localStorage.setItem("sagee_user_id", newGuestId);
        setUserId(newGuestId);
      }
      // If we have a stored ID but no userId in store, use the stored one
      else if (storedUserId && !userId) {
        setUserId(storedUserId);
      }
      // If we have userId in store but no stored ID, save it to localStorage
      else if (userId && !storedUserId) {
        localStorage.setItem("sagee_user_id", userId);
      }
    }
  }, [userId, setUserId]);

  return null;
}
