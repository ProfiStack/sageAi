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
      isFreeScan: false,
      isSubscribed: null,
      shadeMatching: false,
      skinAnalysis: false,
      setToken: (token) => set({ token }),
      setShadeMatching: (shadeMatching) => set({ shadeMatching }),
      setSkinAnalysis: (skinAnalysis) => set({ skinAnalysis }),
      setFreeScan: (isFreeScan) => set({ isFreeScan }),
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
        isSubscribed: state.isSubscribed,
        isFreeScan: state.isFreeScan,
        skinAnalysis: state.skinAnalysis,
        shadeMatching: state.shadeMatching,
      }),
    }
  )
);

export default useAuthStore;
