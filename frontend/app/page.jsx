"use client";

import Dashboard from "@/CustomComponents/dashboard/Dashboard";
import HomePage from "@/CustomComponents/home/Home";
import useAuthStore from "@/store/authStore";

export default function Home() {
  const { token } = useAuthStore();
  if (!token) {
    return <Dashboard />;
  } else {
    return <HomePage />;
  }
}
