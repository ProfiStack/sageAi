import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isUserLoggedIn = (userId) => {
  // Check if userId exists in Zustand store
  if (userId) return true;

  // Check localStorage for user ID, but make sure it's not just a guest ID
  const storedUserId = localStorage.getItem("sagee_user_id");
  const authToken =
    localStorage.getItem("authToken") || document.cookie.includes("authToken");

  // Only consider logged in if we have both a user ID and auth token
  if (storedUserId && authToken && !storedUserId.startsWith("user-")) {
    return true;
  }

  return false;
};
