"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import useFormToast from "./FormToast/FormToast";

export default function ProtectedRoute({ children, requireAuth = true }) {
  const router = useRouter();
  const { userId, isAuthenticated } = useAuthStore();
  const { destructiveToast } = useFormToast();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("sagee_user_id");

      if (requireAuth && !userId && !storedUserId && !isAuthenticated) {
        destructiveToast("Login required");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setIsChecking(false);
      }
    }
  }, [userId, isAuthenticated, requireAuth]);

  return children;
}
