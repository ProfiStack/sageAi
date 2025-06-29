import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: null,
  userId: null,
  setToken: (token) => set({ token }),
  removeToken: () => set({ token: null }),
  setUserId: (userId) => set({ userId }),
  removeUserId: () => set({ userId: null }),
  logout: () => {
    // Clear Zustand state
    set({ token: null, userId: null });

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("sagee_user_id");
      localStorage.removeItem("authToken");
      localStorage.removeItem("sagee_guest_message_count");
    }
  },
}));

export default useAuthStore;
