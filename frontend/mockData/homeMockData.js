import {
  Calendar,
  Heart,
  Palette,
  TrendingUp,
  Search,
  Sparkles,
  Droplets,
  MessageCircle,
  TriangleAlert,
  Bot,
  Zap,
  TestTube,
  Brush,
  Star,
  Camera,
  Award,
  BookOpen,
  Apple,
  Pill,
  Waves,
  Beaker,
  Wand2,
  Shirt,
  CreditCard,
  Leaf,
  Dumbbell,
  Brain,
  Sun,
  Shield,
  Target,
  Lightbulb,
} from "lucide-react";

export const categoryItemsData = [
  {
    title: "Skincare",
    icon: Droplets,
    items: [
      {
        title: "Derm Direct",
        icon: Bot,
        route: "/skincare/chat",
        scanRoute: "/skin-analysis",
        description: "Get personalized skincare advice and routines",
      },
      {
        title: "Trend Truth",
        icon: TrendingUp,
        route: "/skincare/trend-analysis",
        scanRoute: "/skin-analysis",
        description: "Stay updated with latest skincare trends and insights",
      },
      {
        title: "Formula Finder",
        icon: TestTube,
        route: "/skincare/check-ingredients",
        scanRoute: "/product-analysis",
        description:
          "Check product ingredients for allergies and compatibility",
      },
      {
        title: "Skin Strategy",
        icon: Calendar,
        route: "/skincare/treatment-planning",
        scanRoute: "/skin-analysis",
        description: "Create structured skincare treatment schedules",
      },
    ],
  },
  {
    title: "Makeup",
    icon: Palette,
    items: [
      {
        title: "Beauty Brief",
        icon: BookOpen,
        route: "/makeup/beauty-brief",
        scanRoute: "/shade-matching",
        description: "Quick tips and trends in the world of makeup",
      },
      {
        title: "Event Glam",
        icon: Star,
        route: "/makeup/event-glam",
        scanRoute: "/shade-matching",
        description: "Makeup ideas and styles for special occasions",
      },
      {
        title: "Perfect Pair",
        icon: Brush,
        route: "/makeup/perfect-pair",
        scanRoute: "/shade-matching",
        description: "Find the perfect brushes and tools for flawless makeup",
      },
      {
        title: "True Tone",
        icon: Palette,
        route: "/makeup/true-tone",
        scanRoute: "/shade-matching",
        description: "Match products perfectly to your skin tone",
      },
      {
        title: "Beauty Breakdown",
        icon: Camera,
        route: "/makeup/beauty-breakdown",
        scanRoute: "/shade-matching",
        description:
          "Analyze your products and ingredients to see how well they work for you.",
      },
      {
        title: "Flawless Factor",
        icon: Award,
        route: "/makeup/flawless-factor",
        scanRoute: "/shade-matching",
        description: "Evaluate and refine your makeup techniques",
      },
    ],
  },
  {
    title: "Nutrition",
    icon: Heart,
    items: [
      {
        title: "Nutri Guide",
        icon: BookOpen,
        route: "/nutrition/nutri-guide",
        description: "A complete guide to balanced and healthy eating",
      },
      {
        title: "Meal Muse",
        icon: Apple,
        route: "/nutrition/meal-muse",
        description: "Meal inspiration tailored to your health goals",
      },
      {
        title: "Supp Smart",
        icon: Pill,
        route: "/nutrition/supp-smart",
        description: "Smart supplement choices for overall wellness",
      },
    ],
  },
  {
    title: "Hair Care",
    icon: Waves,
    items: [
      {
        title: "Hair Decode",
        icon: Search,
        route: "/hair-care/hair-decode",
        description: "Understand your hair type and needs in detail",
      },
      {
        title: "Formula Focus",
        icon: Beaker,
        route: "/hair-care/formula-focus",
        description: "Discover the right formulas for healthy hair",
      },
      {
        title: "Tress Therapy",
        icon: Sparkles,
        route: "/hair-care/tress-therapy",
        description: "Targeted treatments to revive and nourish hair",
      },
      {
        title: "Style Spark",
        icon: Wand2,
        route: "/hair-care/style-spark",
        description: "Hair styling tips to bring out your best look",
      },
    ],
  },
  {
    title: "Styling",
    icon: Shirt,
    items: [
      {
        title: "Fashion Fix",
        icon: Zap,
        route: "/styling/fashion-fix",
        description: "Quick solutions to refresh your style",
      },
      {
        title: "Shop Smart",
        icon: CreditCard,
        route: "/styling/shop-smart",
        description: "Tips to make the most of your shopping budget",
      },
      {
        title: "Event Edit",
        icon: Sparkles,
        route: "/styling/event-edit",
        description: "Curated outfits for any occasion",
      },
    ],
  },
  {
    title: "Wellness",
    icon: Heart,
    items: [
      {
        title: "Wellness Whisper",
        icon: Leaf,
        route: "/wellness/wellness-whisper",
        description: "Gentle tips for a healthier lifestyle",
      },
      {
        title: "Fit Flow",
        icon: Dumbbell,
        route: "/wellness/fit-flow",
        description: "Fitness routines to match your daily rhythm",
      },
      {
        title: "Zen Zone",
        icon: Brain,
        route: "/wellness/zen-zone",
        description: "Relaxation and mindfulness practices",
      },
      {
        title: "Positivity Pulse",
        icon: Sun,
        route: "/wellness/positivity-pulse",
        description: "Daily habits to boost positivity",
      },
      {
        title: "Stress Reset",
        icon: Shield,
        route: "/wellness/stress-reset",
        description: "Techniques to release and manage stress",
      },
      {
        title: "Self Spark",
        icon: Target,
        route: "/wellness/self-spark",
        description: "Small actions to ignite personal growth",
      },
      {
        title: "Manifest Mode",
        icon: Lightbulb,
        route: "/wellness/manifest-mode",
        description: "Guidance to focus and manifest your goals",
      },
    ],
  },
];

export const comingSoonItemsData = [
  // {
  //   title: "Styling",
  //   icon: Sparkles,
  //   route: "/styling",
  //   description: "Personal style recommendations and wardrobe planning",
  // },
  // {
  //   title: "Wellness",
  //   icon: Heart,
  //   route: "/wellness",
  //   description: "Holistic wellness tracking and lifestyle guidance",
  // },
  // {
  //   title: "Nutrition",
  //   icon: Utensils,
  //   route: "/nutrition",
  //   description: "Nutrition advice for healthy skin and beauty",
  // },
  // {
  //   title: "Haircare",
  //   icon: Scissors,
  //   route: "/haircare",
  //   description: "Hair analysis and personalized care routines",
  // },
];

export const resultPageData = {
  main: [
    {
      id: "chat",
      title: "Skincare",
      description: "Personalized skincare routine",
      icon: <MessageCircle />,
      route: "/chat",
      type: "skincare",
    },
  ],

  professional: [
    {
      id: "treatment-planning",
      title: "Treatment Planning",
      description: "Recommended treatments",
      icon: <Calendar />,
      route: "/treatment-planning",
      type: "treatment_planning",
    },
  ],
  insights: [
    {
      id: "trend-analysis",
      title: "Trend Analysis",
      description: "Verify trends before damaging your skin",
      icon: <TrendingUp />,
      route: "/trend-analysis",
      type: "trend_analysis",
    },
  ],
  otherCategories: [
    {
      id: "check-ingredients",
      title: "Check Ingredients",
      description: "check ingredients applying on skin",
      icon: <TriangleAlert />,
      route: "/check-ingredients",
      type: "ingredient_checker",
    },
  ],
};
