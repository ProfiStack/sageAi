"use client";

import Login from "@/CustomComponents/Login/Login";
import { useHasHydrated } from "@/shared/utils/useHydration";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace("/home"); // ✅ Redirects to home if already logged in
    }
  }, [isAuthenticated, router, hasHydrated]);

  if (!hasHydrated) return null;

  return (
    <div className="flex flex-col justify-between h-screen">
      {!isAuthenticated && <Login />}
    </div>
  );
}
