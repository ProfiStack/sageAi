"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import useFormToast from "./FormToast/FormToast";
import { Api } from "@/shared/api/api";

export default function ProtectedRoute({ children, requireAuth = true }) {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const { destructiveToast } = useFormToast();
  const [isChecking, setIsChecking] = useState(true);
  const { setIsSubscribed } = useAuthStore();

  useEffect(() => {
    const checkRoutes = async () => {
      if (typeof window !== "undefined") {
        const storedUserId = localStorage.getItem("sagee_user_id");

        if (requireAuth && !token && !storedUserId && !isAuthenticated) {
          destructiveToast("Login required");
          setTimeout(() => {
            router.push("/");
          }, 1000);
        } else {
          const profile = await Api.client.getProfile(token);
          if (profile.subscription_status === "active") {
            setIsSubscribed(true);
          } else {
            setIsSubscribed(false);
          }
          setIsChecking(false);
        }
      }
    };
    checkRoutes();
  }, [token, isAuthenticated, requireAuth]);

  return children;
}
