"use client";

import useAuthStore from "@/store/authStore";
import { useEffect, useState } from "react";
import { isLoginValid } from "./utils";

export function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true); // triggers after hydration
  }, []);

  return hasHydrated;
}

export default function AuthChecker({ children }) {
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await isLoginValid();
      setIsAuthenticated(valid);
    };
    checkAuth();
  }, [setIsAuthenticated]);

  return children;
}
