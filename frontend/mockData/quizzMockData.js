// Complete Beauty Quiz Data - All Questions in One Structure
const beautyQuizData = [
  {
    id: "skin_type",
    title: "Skin type",
    allergies: true,
    options: [
      { id: "oily", label: "Oily" },
      { id: "dry", label: "Dry" },
      { id: "combination", label: "Combination" },
      { id: "combination-dry", label: "Combination dry" },
      { id: "combination-oily", label: "Combination oily" },
      { id: "sensitive", label: "Sensitive" },
      { id: "normal", label: "Normal" },
    ],
  },
  {
    id: "concern",
    title: "Concerns",
    options: [
      { id: "breakouts", label: "Breakouts" },
      { id: "discoloration", label: "Discoloration" },
      { id: "redness", label: "Redness" },
      { id: "aging", label: "Aging" },
      { id: "dullness", label: "Dullness" },
    ],
  },
];

const makeupQuizData = [
  {
    id: "skin_type",
    title: "Skin type",
    allergies: true,
    options: [
      { id: "oily", label: "Oily" },
      { id: "dry", label: "Dry" },
      { id: "combination", label: "Combination" },
      { id: "combination-dry", label: "Combination dry" },
      { id: "combination-oily", label: "Combination oily" },
      { id: "sensitive", label: "Sensitive" },
      { id: "normal", label: "Normal" },
    ],
  },
  {
    id: "makeup_goal",
    title: "Makeup goal",
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
  },
];

const nutritionQuizData = [
  {
    id: "nutrition_goal",
    title: "Nutrition goal",
    allergies: false,
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
  },
  {
    id: "dietary_restriction",
    title: "Dietary restrictions",
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
  },
];

const wellnessQuizData = [
  {
    id: "wellness_focus",
    title: "Wellness focus",
    allergies: false,
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
  },
  {
    id: "dedicate_time",
    title: "Daily wellness duration",
    options: [
      { id: "5-10 minutes", label: "5-10 minutes" },
      { id: "15-20 minutes", label: "15-20 minutes" },
      {
        id: "30+ minutes",
        label: "30+ minutes",
      },
      { id: "It varies", label: "It varies" },
    ],
  },
];

const hairCareQuizData = [
  {
    id: "hair_type",
    title: "Hair type",
    allergies: true,
    options: [
      { id: "Straight", label: "Straight" },
      {
        id: "Wavy",
        label: "Wavy",
      },
      {
        id: "Curly",
        label: "Curly",
      },
      { id: "Coily/Kinky", label: "Coily/Kinky" },
      { id: "Not Sure", label: "Not Sure" },
    ],
  },
  {
    id: "hair_concern",
    title: "Hair concern",
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
  },
];

const stylingQuizData = [
  {
    id: "style_preference",
    title: "Style preference",
    allergies: false,
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
  },
  {
    id: "styling_goal",
    title: "Styling goal",
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
