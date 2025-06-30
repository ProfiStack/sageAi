import useAuthStore from "@/store/authStore";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isUserLoggedIn = (userId) => {
  // Check if userId exists and is NOT a guest user
  if (userId && !userId.startsWith("user-")) {
    return true;
  }

  // If userId is a guest user, continue to check other sources
  if (userId && userId.startsWith("user-")) {
    console.log("User is guest user, checking other auth sources");
  }

  // Only run browser-specific code on the client side
  if (typeof window === "undefined") {
    return false; // Return false during SSR
  }

  // Check localStorage for user ID, but make sure it's not just a guest ID
  const storedUserId = localStorage.getItem("sagee_user_id");
  const authToken =
    localStorage.getItem("authToken") || document.cookie.includes("authToken");

  // Only consider logged in if we have both a user ID and auth token
  // AND the stored user ID is not a guest user
  if (storedUserId && authToken && !storedUserId.startsWith("user-")) {
    return true;
  }

  return false;
};
