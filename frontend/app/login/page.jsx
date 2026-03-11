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
      router.replace("/");
    }
  }, [token]);

  if (token) return null;

  return <Login />;
}
