import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  removeAuthToken,
  removeLoginTimestamp,
  removeRefreshToken,
} from "@/shared/utils/utils";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userId: null,
      isAuthenticated: false,
      isSubscribed: null,
      setToken: (token) => set({ token }),
      removeToken: () => set({ token: null }),
      setUserId: (userId) => set({ userId }),
      removeUserId: () => set({ userId: null }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setIsSubscribed: (isSubscribed) => set({ isSubscribed }),
      removeIsAuthenticated: () => set({ isAuthenticated: false }),
      logout: async () => {
        // Clear store state first
        set({ token: null, userId: null, isAuthenticated: false });

        // Clear localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("sagee_user_id");
          localStorage.removeItem("token");
          localStorage.removeItem("auth-store");
        }

        // Call other cleanup functions but don't manipulate store again
        await removeAuthToken();
        await removeRefreshToken();
        await removeLoginTimestamp();
      },
    }),
    {
      name: "auth-store", // 🗂 localStorage key
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        userId: state.userId,
      }),
    }
  )
);

export default useAuthStore;
