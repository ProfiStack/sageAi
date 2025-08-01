import {
  Calendar,
  Heart,
  Palette,
  Scissors,
  TrendingUp,
  ScanFace,
  Search,
  ShoppingBag,
  Sparkles,
  Droplets,
  FlaskConical,
  Utensils,
  Eye,
} from "lucide-react";

export const categoryItemsData = [
  {
    title: "Image Analysis",
    icon: ScanFace,
    items: [
      {
        title: "Skin Analysis",
        icon: Eye,
        route: "/skin-analysis",
        description:
          "AI-powered skin assessment and personalized recommendations",
      },
      {
        title: "Mole Analysis",
        icon: Search,
        route: "/mole-analysis",
        description: "Advanced mole detection and health monitoring",
      },
      {
        title: "Product Analysis",
        icon: ShoppingBag,
        route: "/product-analysis",
        description: "Scan and analyze beauty products for compatibility",
      },
      {
        title: "Shade Matching",
        icon: Palette,
        route: "/shade-matching",
        description: "Find your perfect foundation and concealer shades",
      },
    ],
  },
  {
    title: "Makeup",
    icon: Palette,
    items: [
      {
        title: "Makeup",
        icon: Palette,
        route: "/makeup",
        description: "Virtual makeup try-on and tutorials",
      },
      {
        title: "Makeup Looks Recommendation",
        icon: Sparkles,
        route: "/makeup-looks",
        description: "Personalized makeup looks based on your features",
      },
      {
        title: "Makeup Tool Match",
        icon: ShoppingBag,
        route: "/makeup-tools",
        description: "Find the right brushes and tools for your needs",
      },
      {
        title: "Makeup Product Match",
        icon: Search,
        route: "/makeup-products",
        description: "Discover products that work best for your skin",
      },
      {
        title: "Technique Validation",
        icon: Eye,
        route: "/technique-validation",
        description: "Get feedback on your makeup application skills",
      },
    ],
  },
  {
    title: "Skincare",
    icon: Droplets,
    items: [
      {
        title: "Skincare",
        icon: Droplets,
        route: "/chat",
        description: "Get personalized skincare advice and routines",
      },
      {
        title: "Trend Analysis",
        icon: TrendingUp,
        route: "/trend-analysis",
        description: "Stay updated with latest skincare trends and insights",
      },
      {
        title: "Ingredients Analyzer",
        icon: FlaskConical,
        route: "/check-ingredients",
        description:
          "Check product ingredients for allergies and compatibility",
      },
      {
        title: "Treatment Planning",
        icon: Calendar,
        route: "/treatment-planning",
        description: "Create structured skincare treatment schedules",
      },
    ],
  },
];

export const comingSoonItemsData = [
  {
    title: "Styling",
    icon: Sparkles,
    route: "/styling",
    description: "Personal style recommendations and wardrobe planning",
  },
  {
    title: "Wellness",
    icon: Heart,
    route: "/wellness",
    description: "Holistic wellness tracking and lifestyle guidance",
  },
  {
    title: "Nutrition",
    icon: Utensils,
    route: "/nutrition",
    description: "Nutrition advice for healthy skin and beauty",
  },
  {
    title: "Haircare",
    icon: Scissors,
    route: "/haircare",
    description: "Hair analysis and personalized care routines",
  },
];
