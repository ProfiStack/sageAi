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
    icon: <ScanFace className="w-5 h-5" />,

    title: "Unlock Your Skin's Potential",
    subTitle: "Personalized skincare tips and ideal makeup shades in one scan",
  },
  {
    icon: <Shield className="w-5 h-5" />,

    title: "Look Amazing Every Day",
    subTitle: " Personalized advice for your skin, makeup & hair",
  },
  {
    icon: <Utensils className="w-5 h-5" />,
    title: "Eat for Your Best Skin & Energy",
    subTitle: "Nutrition plans that actually show results",
  },
  {
    icon: <Search className="w-5 h-5" />,
    title: " Check Products, Ingredients & Trends",
    subTitle: " Instant ingredient analysis & trend truth checking",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: "Never Buy Fake Products Again",
    subTitle: "Protect your skin from dangerous counterfeits",
  },
];

export const comingSoonData = [
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
];
