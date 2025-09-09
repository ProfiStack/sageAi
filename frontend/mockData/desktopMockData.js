import {
  Heart,
  Palette,
  Search,
  Droplets,
  Waves,
  Shirt,
  Brain,
  Shield,
  CheckCircle,
  Scan,
  ScanFace,
  Utensils,
  Atom,
} from "lucide-react";
export const features = [
  {
    icon: <ScanFace className="w-6 h-6" />,
    title: "Face Scan for skin analysis and shade matching",
    description:
      "Try AI-powered Scan for skin care and suggesting shades that best matches your skin",
  },
  {
    icon: <Utensils className="w-6 h-6" />,
    title: "Intelligent Guidance for Nutrition and Wellness",
    description:
      "Try AI-powered nutrition plans and wellness routines tailored to your lifestyle",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Smart Consultation for Skin, Makeup, Hair and Styling",
    description:
      "Get personalized beauty advice from our advanced AI consultants",
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Check Products, Ingredients & Trends",
    description:
      "Analyze ingredients, check compatibility, and stay ahead of beauty trends",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Detect Fakes Before They Touch Your Skin",
    description:
      "Protect yourself with our advanced counterfeit detection technology",
  },
];

export const comingSoon = [
  {
    icon: <Atom className="w-6 h-6" />,
    title: "Image based Mole Analysis",
    color: "bg-gradient-to-r from-[#02331E] to-[#D4B038]",
  },
  {
    icon: <Scan className="w-6 h-6" />,
    title: "Image based Product Analysis",
    color: "bg-gradient-to-r from-[#02331E] to-[#D4B038]",
  },
];

export const categoriesData = [
  {
    name: "Scan",
    icon: ScanFace,
    count: "2 Tools",
    color: "bg-gradient-to-r from-[#02331E] to-[#D4B038]",
  },
  {
    name: "Skincare",
    icon: Droplets,
    count: "4 Tools",
    color: "bg-gradient-to-r from-[#02331E] to-[#D4B038]",
  },
  {
    name: "Makeup",
    icon: Palette,
    count: "6 Tools",
    color: "bg-gradient-to-r from-[#02331E] to-[#D4B038]",
  },
  {
    name: "Nutrition",
    icon: Heart,
    count: "3 Tools",
    color: "bg-gradient-to-r from-[#02331E] to-[#D4B038]",
  },
  {
    name: "Hair Care",
    icon: Waves,
    count: "4 Tools",
    color: "bg-gradient-to-r from-[#02331E] to-[#D4B038]",
  },
  {
    name: "Styling",
    icon: Shirt,
    count: "3 Tools",
    color: "bg-gradient-to-r from-[#02331E] to-[#D4B038]",
  },
  {
    name: "Wellness",
    icon: Brain,
    count: "7 Tools",
    color: "bg-gradient-to-r from-[#02331E] to-[#D4B038]",
  },
];
