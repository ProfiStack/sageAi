import { create } from "zustand";
import { persist } from "zustand/middleware";
import { autoLogout } from "@/shared/utils/utils";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userId: null,
      isAuthenticated: false,
      setToken: (token) => set({ token }),
      removeToken: () => set({ token: null }),
      setUserId: (userId) => set({ userId }),
      removeUserId: () => set({ userId: null }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      removeIsAuthenticated: () => set({ isAuthenticated: false }),
      logout: async () => {
        set({ token: null, userId: null, isAuthenticated: false });
        await autoLogout();
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-store");
        }
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
