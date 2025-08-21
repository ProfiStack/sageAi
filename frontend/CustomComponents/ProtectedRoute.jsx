"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import useFormToast from "./FormToast/FormToast";
import { Api } from "@/shared/api/api";

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireSubscription = false,
}) {
  const router = useRouter();
  const { token, setIsSubscribed } = useAuthStore();
  const { destructiveToast } = useFormToast();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkRoutes = async () => {
      if (typeof window === "undefined") return;

      const storedUserId = localStorage.getItem("sagee_user_id");

      // Case 1: Requires auth but not logged in
      if (requireAuth && !token && !storedUserId) {
        destructiveToast("Login required");
        router.push("/");
        setIsChecking(false);
        return;
      }

      // Case 2: Requires subscription
      if (requireSubscription && token && storedUserId) {
        try {
          const profile = await Api.client.getProfile(token);
          if (profile.subscription_status === "active") {
            setIsSubscribed(true);
          } else {
            setIsSubscribed(false);
            router.push("/home");
            setIsChecking(false);
            return;
          }
        } catch (err) {
          setIsSubscribed(false);
          router.push("/home");
          setIsChecking(false);
          return;
        }
      }

      setIsChecking(false);
    };

    checkRoutes();
  }, [token, requireAuth, requireSubscription, router]);

  return <>{children}</>;
}
