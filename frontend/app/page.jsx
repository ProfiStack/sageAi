"use client";
import HomePage from "@/CustomComponents/home/Home";
import DesktopHomePage from "../DesktopComponents/desktop/homePage/HomePage";
import { useHasHydrated } from "@/shared/utils/useHydration";
import { isMobileClient } from "@/shared/utils/utils";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const { isAuthenticated, token } = useAuthStore();
  useEffect(() => {
    if (!hasHydrated) return;

    if (isMobileClient()) {
      // ✅ On mobile
      if (hasHydrated && isAuthenticated && token) {
        router.replace("/");
      }
    }
  }, [isAuthenticated, token, hasHydrated, router]);

  //useEffect(() => {
  //if (hasHydrated && isAuthenticated && token) {
  //router.replace("/home"); // ✅ Redirects to home if already logged in
  //}
  //}, [isAuthenticated, router, hasHydrated]);

  if (!hasHydrated) return null;

  return (
    <div className="flex flex-col justify-between h-screen">
      {isMobileClient() ? <HomePage /> : <DesktopHomePage />}
    </div>
  );
}
