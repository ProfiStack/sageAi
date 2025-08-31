import { create } from "zustand";
import { persist } from "zustand/middleware";

// Existing store
export const useSkinResultStore = create(
  persist(
    (set) => ({
      html: null,
      setHtml: (html) => set({ html }),
    }),
    {
      name: "skin-result-storage",
    }
  )
);

// New separate store
export const useShadeMatchStore = create(
  persist(
    (set) => ({
      shadeResult: null,
      setShadeResult: (shadeResult) => set({ shadeResult }),
    }),
    {
      name: "shade-result-storage",
    }
  )
);
