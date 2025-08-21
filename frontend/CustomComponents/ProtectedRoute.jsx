"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import useFormToast from "./FormToast/FormToast";
import { Api } from "@/shared/api/api";

export default function ProtectedRoute({ children, requireAuth = true, requireSubscription = false }) {
  const router = useRouter();
  const { token } = useAuthStore();
  const { destructiveToast } = useFormToast();
  const [isChecking, setIsChecking] = useState(true);
  const { setIsSubscribed } = useAuthStore();

  useEffect(() => {
    const checkRoutes = async () => {
      if (typeof window !== "undefined") {
        const storedUserId = localStorage.getItem("sagee_user_id");
        if (requireAuth && !token && !storedUserId) {
          destructiveToast("Login required");
          router.push("/");
        } else if(requireAuth && token && storedUserId) {
          const profile = await Api.client.getProfile(token);
          if (requireSubscription && profile.subscription_status === "active") {
            setIsSubscribed(true);
          } else {
            setIsSubscribed(false);
            router.push('/home')
          }
          setIsChecking(false);
        } else {
          setIsChecking(false)
        }
      }
    };
    checkRoutes();
  }, [token, requireAuth]);

  return children;
}
