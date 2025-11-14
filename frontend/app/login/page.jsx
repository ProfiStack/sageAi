"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import Login from "@/CustomComponents/Login/Login";

export default function LoginPage() {
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace("/"); // redirect logged-in users to home (or dashboard)
    }
  }, [token]);

  if (token) return null; // avoid flicker while redirecting

  return <Login />;
}
