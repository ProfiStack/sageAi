"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function AuthInitializer() {
  const { setToken, token, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    console.log("AuthInitializer effect running:", { token });

    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("token");

      // If we don't have a token in store and no stored ID, create a new guest user
      if (!token && !storedUserId) {
        setIsAuthenticated(false);
      }
      // If we have a stored ID but no token in store, use the stored one
      else if (storedUserId && !token) {
        setToken(storedUserId);
        console.log("AuthInitializer: Using stored token:", storedUserId);
      }
      // If we have token in store but no stored ID, save it to localStorage
      else if (token && !storedUserId) {
        localStorage.setItem("token", token);
        console.log("AuthInitializer: Saved token to localStorage:", token);
      }
    }
  }, [token, setToken]);

  return null;
}
