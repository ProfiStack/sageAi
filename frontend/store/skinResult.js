import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useSkinResultStore = create(
  persist(
    (set) => ({
      html: "",
      setHtml: (html) => set({ html }),
    }),
    {
      name: "skin-result-storage", // Key in localStorage
    }
  )
);
