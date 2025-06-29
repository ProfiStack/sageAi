// Complete Beauty Quiz Data - All Questions in One Structure
const beautyQuizData = [
  {
    id: "skin-type",
    title: "What's your skin type?",
    type: "single-choice",
    options: [
      { id: "oily", label: "Oily" },
      { id: "dry", label: "Dry" },
      { id: "combination", label: "Combination" },
      { id: "combination-dry", label: "Combination dry" },
      { id: "combination-oily", label: "Combination oily" },
      { id: "sensitive", label: "Sensitive" },
      { id: "normal", label: "Normal" },
    ],
    selectedOptions: [],
  },
  {
    id: "skin-concerns",
    title: "What specific concerns would you like to address?",
    type: "multiple-choice",
    options: [
      { id: "breakouts", label: "Breakouts" },
      { id: "⁠Discoloration", label: "⁠Discoloration" },
      { id: "redness", label: "Redness" },
      { id: "ageing", label: "Ageing" },
      { id: "dullness", label: "Dullness" },
    ],
    selectedOptions: [],
  },
];

export { beautyQuizData };
