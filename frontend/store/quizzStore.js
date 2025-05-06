import { create } from "zustand";
export const useQuizzStore = create((set) => ({
  answers: {},
  setAnswers: (question, answer) =>
    set((state) => ({
      answers: { ...state.answers, [question]: answer },
    })),
}));
