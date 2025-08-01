import {
  CheckCircle,
  Heart,
  Scan,
  Scissors,
  Search,
  Shield,
  Utensils,
} from "lucide-react";
export const featuresData = [
  {
    icon: <Scan className="w-5 h-5" />,

    title: "Image-Based Skin & Mole Analysis",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Smart Sunscreen & Shade Matching",
  },
  {
    icon: <Search className="w-5 h-5" />,
    title: "Check Products, Ingredients & Trends",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: "Detect Fakes Before They Touch Your Skin",
  },
];

export const comingSoonData = [
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Wellness",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: <Utensils className="w-5 h-5" />,
    title: "Nutrition",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <Scissors className="w-5 h-5" />,
    title: "Haircare",
    color: "from-purple-500 to-indigo-500",
  },
];
