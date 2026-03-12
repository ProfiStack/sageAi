import { useState } from "react";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Api } from "@/shared/api/api";
import SubscribeButton from "../button/Subscribe";
import useAuthStore from "@/store/authStore";
import LoginScanPopup from "./LoginPopup";
import Image from "next/image";

const SCAN_IMAGE_MAP = {
  "Derm Direct": "/images/scan.png",
  "Product Analysis": "/images/productPopup.png",
  "True Tone": "/images/shadematchpopup.png",
};

const SkinPopup = ({ isOpen, onClose, selectedItem, onChatClick }) => {
  if (!isOpen || !selectedItem) return null;
  const [price, setPrice] = useState("");
  const [isloginOpen, setIsLoginOpen] = useState(false);
  const {
    isSubscribed,
    shadeMatching,
    skinAnalysis,
    isFreeScan,
    isAuthenticated,
  } = useAuthStore();

  

  const scanImage = SCAN_IMAGE_MAP[selectedItem.title] ?? "/images/scan.png";

  useEffect(() => {
    const fetchPrices = async () => {
      const response = await Api.client.prices();
      setPrice(response);
    };
    fetchPrices();
  }, []);

  const handleLoginPopup = () => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
    }
  };

  const handleClose = () => {
    setIsLoginOpen(false);
  };

  const getScanLabel = () => {
    if (isFreeScan) {
      return "Free Scan";
    }
    if (!isAuthenticated) {
      return "Login";
    }
    if (!isFreeScan && !shadeMatching && selectedItem.title === "True Tone") {
      return "Quick Scan Free";
    }
    if (!isFreeScan && !skinAnalysis && selectedItem.title === "Derm Direct") {
      return "Quick Scan Free";
    }
    if (!isFreeScan && shadeMatching && selectedItem.title === "True Tone") {
      return "Quick Scan Free";
    }
    if (!isFreeScan && skinAnalysis && selectedItem.title === "Derm Direct") {
      return "Quick Scan Free";
    }
    return "";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
  <div className="w-full max-w-md bg-[#02331E] rounded-2xl overflow-hidden shadow-2xl">

    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4">
      <button onClick={onClose}>
        <X className="w-5 h-5 text-white" />
      </button>

      <span className="text-[10px] uppercase text-white tracking-widest font-bold opacity-80">
        Sagee AI
      </span>

      <div className="w-5" />
    </div>

    {/* Title Section */}
    <div className="text-center px-6 mt-2 mb-8">
      <h1 className="font-serif italic text-3xl text-white mb-3">
        {selectedItem.title}
      </h1>
      <p className="text-sm text-white max-w-[260px] mx-auto">
        {selectedItem.description}
      </p>
    </div>

    {/* Cards */}
    <div className="flex flex-col space-y-6 px-6 pb-10">

      {/* Chat Card */}
      <button
  onClick={() => onChatClick(selectedItem)}
  className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-md hover:shadow-xl transition-all duration-300"
>
  <div className="relative aspect-[4/3]">

    {/* Background Image */}
    <Image
      src="/images/chat.png"
      alt="Chat Background"
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      priority
    />

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

    {/* Badge */}
    <div className="absolute top-4 right-4 bg-[#D4B038] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest shadow">
      FREE
    </div>
  </div>

  {/* Content */}
  <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
    <h2 className="text-2xl font-serif text-white mb-1">
      Consult via Chat
    </h2>

    <p className="text-xs text-white/70 mb-4">
    Ask me anything and get instant answers about your
    routine, products, or concerns
    </p>

    <div className="w-full bg-[#D4B038] text-white font-bold py-3.5 rounded-xl flex items-center justify-center active:scale-95 transition">
      <span className="text-sm uppercase tracking-widest">
        Select Chat
      </span>
    </div>
  </div>
</button>

      {/* Scan Card */}
      <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-md hover:shadow-xl transition-all duration-300">

<div className="relative aspect-[4/3]">

  {/* Background Image */}
  <Image
    src={scanImage}
    alt="Scan Background"
    fill
    className="object-cover transition-transform duration-500 group-hover:scale-105"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

  {/* Badge */}
  <div className="absolute top-4 right-4 bg-[#D4B038] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest shadow">
    {getScanLabel()}
  </div>
</div>

{/* Content */}
<div className="absolute bottom-0 left-0 right-0 p-6 text-left">
  <h2 className="text-2xl font-serif text-white mb-1">
    Instant Scan
  </h2>

  <p className="text-xs text-white/70 mb-4">
  Analyze My Skin and in 30-seconds get personalized recommendations Private & secure photos are deleted after analysis
  </p>

  {isAuthenticated ? (
    <SubscribeButton route={selectedItem.scanRoute}>
      <div className="w-full bg-[#D4B038] text-white font-bold py-3.5 rounded-xl flex items-center justify-center active:scale-95 transition">
        <span className="text-sm uppercase tracking-widest">
          Start Scan
        </span>
      </div>
    </SubscribeButton>
  ) : (
    <button
      onClick={handleLoginPopup}
      className="w-full bg-[#D4B038] text-white font-bold py-3.5 rounded-xl flex items-center justify-center active:scale-95 transition"
    >
      <span className="text-sm uppercase tracking-widest">
        Login to Scan
      </span>
    </button>
  )}
</div>
</div>
</div>
</div>
{isloginOpen && <LoginScanPopup onClose={handleClose} />}
</div>
   
  );
};

export default SkinPopup;
