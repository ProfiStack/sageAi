"use client";
import Signup from "@/CustomComponents/Signup/signup";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace("/");
    }
  }, [token]);

  if (token) return null;
  return (
    <>
      <Signup />
    </>
  );
}
