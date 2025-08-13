import {
  Atom,
  CheckCircle,
  Palette,
  Scan,
  ScanBarcodeIcon,
  ScanFace,
  Search,
  Shield,
  Utensils,
} from "lucide-react";
export const featuresData = [
  {
    icon: <Utensils className="w-5 h-5" />,

    title: "Intelligent Guidance for Nutrition and Wellness",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Smart Consultation for Skin, Makeup, Hair and Styling",
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
    icon: <ScanFace className="w-5 h-5" />,
    title: "Image based Skin Analysis",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: <Atom className="w-5 h-5" />,
    title: "Image based Mole Analysis",
    color: "from-green-500 to-emerald-500",
  },

  {
    icon: <ScanBarcodeIcon className="w-5 h-5" />,
    title: "Image based Product Analysis",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: "Image based Shade Matching",
    color: "from-green-500 to-emerald-500",
  },
];
