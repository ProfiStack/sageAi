"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function AuthInitializer() {
  const { setUserId } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from localStorage
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("sagee_user_id");
      if (storedUserId) {
        console.log(
          "AuthInitializer: Setting userId from localStorage:",
          storedUserId
        );
        setUserId(storedUserId);
      }
    }
  }, [setUserId]);

  // This component doesn't render anything
  return null;
}
