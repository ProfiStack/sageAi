import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useQuizzStore = create(
  persist(
    (set) => ({
      quizzData: null,
      setQuizzData: (data) => set({ quizzData: data }),

      answers: {},
      setAnswers: (question, answer) =>
        set((state) => ({
          answers: { ...state.answers, [question]: answer },
        })),
    }),
    {
      name: "quizz-storage", // Key in localStorage
    }
  )
);
