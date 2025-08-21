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
  const { token, setIsSubscribed, isSubscribed } = useAuthStore();
  const { destructiveToast } = useFormToast();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkRoutes = async () => {
      try {
        if (typeof window === "undefined") return;

        const storedUserId = localStorage.getItem("sagee_user_id");

        // Case 1: Requires auth but not logged in
        if (requireAuth && !token && !storedUserId) {
          destructiveToast("Login required");
          router.push("/");
          setIsChecking(false);
          return;
        }

        // Case 2: User is logged in - check profile and subscription
        if (token && storedUserId) {
          try {
            const profile = await Api.client.getProfile(token);
            
            // Update subscription status in store
            const hasActiveSubscription = profile.subscription_status === "active";
            setIsSubscribed(hasActiveSubscription);

            // Case 3: Requires subscription but user doesn't have active subscription
            if (requireSubscription && !hasActiveSubscription) {
              destructiveToast("Subscription required to access this content");
              router.push("/home");
              setIsChecking(false);
              return;
            }

            // Case 4: All checks passed - user can access the route
            setIsChecking(false);
            return;

          } catch (err) {
            console.error("Error fetching profile:", err);
            destructiveToast("Unable to verify account status");
            setIsSubscribed(false);
            router.push("/home");
            setIsChecking(false);
            return;
          }
        }

        // Case 5: No auth required and user not logged in - allow access
        if (!requireAuth) {
          setIsChecking(false);
          return;
        }

        // Fallback case
        setIsChecking(false);

      } catch (error) {
        console.error("Error in route protection:", error);
        setIsChecking(false);
      }
    };

    checkRoutes();
  }, [token, requireAuth, requireSubscription, router]);

  return <>{children}</>;
}