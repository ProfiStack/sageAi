import {
  AlertTriangle,
  Apple,
  Calendar,
  Heart,
  MapPin,
  MessageCircle,
  Palette,
  Scissors,
  TrendingUp,
} from "lucide-react";

export const mockPageData = {
  main: [
    {
      id: "chat",
      title: "Chat",
      description: "Chat with Consultant",
      icon: <MessageCircle />,
      route: "/chat",
    },
  ],

  insights: [
    {
      id: "trend-analysis",
      title: "Trend Analysis",
      description: "Real-time trend analysis with expert insights.",
      icon: <TrendingUp />,
      route: "/trend-analysis",
    },
    {
      id: "check-ingredients",
      title: "Check Ingredients",
      description: "Check product ingredients for compatibility.",
      icon: <AlertTriangle />,
      route: "/check-ingredients",
    },
  ],

  professional: [
    {
      id: "treatment-planning",
      title: "Treatment Planning",
      description: "Professional treatment options and explanations.",
      icon: <Calendar />,
      route: "/treatment-planning",
    },
    {
      id: "find-providers",
      title: "Find Providers",
      description: "Find qualified providers in your area.",
      icon: <MapPin />,
      route: "/find-providers",
    },
  ],

  otherCategories: [
    {
      id: "nutrition",
      title: "Nutrition",
      description: "Personalized nutrition guidance.",
      icon: <Apple />,
      route: "/nutrition",
    },
    {
      id: "haircare",
      title: "Haircare",
      description: "Haircare recommendations and tips.",
      icon: <Scissors />,
      route: "/hair-care",
    },
    {
      id: "wellness",
      title: "Wellness",
      description: "Personalized wellness plans and progress tracking.",
      icon: <Heart />,
      route: "/wellness",
    },
    {
      id: "styling-makeup",
      title: "Styling and Makeup",
      description: "Expert styling advice and virtual try-on tools.",
      icon: <Palette />,
      route: "/styling",
    },
  ],
};
