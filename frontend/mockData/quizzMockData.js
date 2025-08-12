// Complete Beauty Quiz Data - All Questions in One Structure
const beautyQuizData = [
  {
    id: "skin_type",
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
    id: "concern",
    title: "What specific concerns would you like to address?",
    type: "single-choice",
    options: [
      { id: "breakouts", label: "Breakouts" },
      { id: "discoloration", label: "Discoloration" },
      { id: "redness", label: "Redness" },
      { id: "aging", label: "Aging" },
      { id: "dullness", label: "Dullness" },
    ],
    selectedOptions: [],
  },
];

const makeupQuizData = [
  {
    id: "skin_type",
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
    id: "makeup_goal",
    title: "What's your main makeup goal?",
    type: "single-choice",
    options: [
      { id: "Natural everyday look", label: "Natural everyday look" },
      { id: "Full glam/evening looks", label: "Full glam/evening looks" },
      {
        id: "Professional/work appropriate",
        label: "Professional/work appropriate",
      },
      { id: "Learn basic techniques", label: "Learn basic techniques" },
      {
        id: "Color matching and application",
        label: "Color matching and application",
      },
    ],
    selectedOptions: [],
  },
];

const nutritionQuizData = [
  {
    id: "nutrition_goal",
    title: "What's your primary nutrition goal?",
    type: "single-choice",
    options: [
      { id: "Weight loss", label: "Weight loss" },
      {
        id: "Weight gain/muscle building",
        label: "Weight gain/muscle building",
      },
      {
        id: " Better skin/hair/nail health",
        label: " Better skin/hair/nail health",
      },
      { id: "More energy", label: "More energy" },
      { id: "General wellness", label: "General wellness" },
    ],
    selectedOptions: [],
  },
  {
    id: "dietary_restrictions",
    title: "Do you follow any dietary restrictions?",
    type: "single-choice",
    options: [
      { id: "None", label: "None" },
      { id: "Vegetarian/Vegan", label: "Vegetarian/Vegan" },
      {
        id: "Gluten-free",
        label: "Gluten-free",
      },
      { id: "Keto/Low-carb", label: "Keto/Low-carb" },
      {
        id: "Other allergies/intolerances",
        label: "Other allergies/intolerances",
      },
    ],
    selectedOptions: [],
  },
];

const wellnessQuizData = [
  {
    id: "wellness_focus",
    title: "What's your main wellness focus?",
    type: "single-choice",
    options: [
      { id: "Stress management", label: "Stress management" },
      {
        id: "Better sleep",
        label: "Better sleep",
      },
      {
        id: " Mental health support",
        label: " Mental health support",
      },
      { id: "Fitness/exercise", label: "Fitness/exercise" },
      { id: "Building confidence", label: "Building confidence" },
    ],
    selectedOptions: [],
  },
  {
    id: "dedicate_time",
    title: "How much time can you dedicate to wellness daily?",
    type: "single-choice",
    options: [
      { id: "5-10 minutes", label: "5-10 minutes" },
      { id: "15-20 minutes", label: "15-20 minutes" },
      {
        id: "30+ minutes",
        label: "30+ minutes",
      },
      { id: "It varies", label: "It varies" },
    ],
    selectedOptions: [],
  },
];

const hairCareQuizData = [
  {
    id: "hair_type",
    title: "What's your hair type?",
    type: "single-choice",
    options: [
      { id: "Straight", label: "Straight" },
      {
        id: "Wavy",
        label: "Wavy",
      },
      {
        id: " Curly",
        label: " Curly",
      },
      { id: "Coily/Kinky", label: "Coily/Kinky" },
      { id: "Not Sure", label: "Not Sure" },
    ],
    selectedOptions: [],
  },
  {
    id: "hair_concern",
    title: "What's your main hair concern?",
    type: "single-choice",
    options: [
      { id: "Dryness and damage", label: "Dryness and damage" },
      { id: "Oily scalp", label: "Oily scalp" },
      {
        id: "Hair loss/thinning",
        label: "Hair loss/thinning",
      },
      { id: "Frizz and unmanageability", label: "Frizz and unmanageability" },
      { id: "Lack of volume", label: "Lack of volume" },
    ],
    selectedOptions: [],
  },
];

const stylingQuizData = [
  {
    id: "style_preference",
    title: "What's your current style preference?",
    type: "single-choice",
    options: [
      { id: "Classic and timeless", label: "Classic and timeless" },
      {
        id: "Trendy and fashion-forward",
        label: "Trendy and fashion-forward",
      },
      {
        id: "  Casual and comfortable",
        label: "  Casual and comfortable",
      },
      { id: " Professional and polished", label: " Professional and polished" },
      { id: " Still figuring it out", label: " Still figuring it out" },
    ],
    selectedOptions: [],
  },
  {
    id: "styling_goal",
    title: "What's your main styling goal?",
    type: "single-choice",
    options: [
      {
        id: "Learn to dress for my body type",
        label: "Learn to dress for my body type",
      },
      { id: "Build a versatile wardrobe", label: "Build a versatile wardrobe" },
      {
        id: "Stay trendy on budget",
        label: "Stay trendy on budget",
      },
      {
        id: "Look put-together with minimal effort",
        label: "Look put-together with minimal effort",
      },
      {
        id: "Express my personality through style",
        label: "Express my personality through style",
      },
    ],
    selectedOptions: [],
  },
];

export {
  beautyQuizData,
  makeupQuizData,
  nutritionQuizData,
  hairCareQuizData,
  wellnessQuizData,
  stylingQuizData,
};
