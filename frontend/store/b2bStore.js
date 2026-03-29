import { create } from "zustand";
import { persist } from "zustand/middleware";

const useB2BStore = create(
  persist(
    (set) => ({
      apiKey: null,
      clientId: null,
      clientName: null,
      isAuthenticated: false,

      setAuth: ({ apiKey, clientId, clientName }) =>
        set({ apiKey, clientId, clientName, isAuthenticated: true }),

      logout: () =>
        set({ apiKey: null, clientId: null, clientName: null, isAuthenticated: false }),
    }),
    { name: "b2b-store" }
  )
);

export default useB2BStore;
