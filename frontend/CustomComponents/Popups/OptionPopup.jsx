import { X } from "lucide-react";
import Image from "next/image";
const SCAN_IMAGE_MAP = {
  "Derm Direct": "/images/scan.png",
  "Product Analysis": "/images/productPopup.png",
  "Shade Matching": "/images/shadematchpopup.png",
};


const OptionPopup = ({
  isOpen,
  onClose,
  selectedItem,
  onChatClick,
}) => {
  if (!isOpen || !selectedItem) return null;

  

  const scanImage = SCAN_IMAGE_MAP[selectedItem.title] ?? "/images/scan.png";

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

        {/* Title */}
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
              <Image
                src="/images/chat.png"
                alt="Chat"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Badge */}
              <div className="absolute top-4 right-4 bg-[#D4B038] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest shadow">
                FREE
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
              <h2 className="text-2xl font-serif text-white mb-1">
                Chat
              </h2>

              <p className="text-xs text-white/70 mb-4">
                Ask me anything and get instant answers about your routine,
                products, or concerns
              </p>

              <div className="w-full bg-[#D4B038] text-white font-bold py-3.5 rounded-xl flex items-center justify-center active:scale-95 transition">
                <span className="text-sm uppercase tracking-widest">
                  Select Chat
                </span>
              </div>
            </div>
          </button>

          {/* Scan Card */}
          <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-md opacity-90">

            <div className="relative aspect-[4/3]">
              <Image
                src={scanImage}
                alt="Scan"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Badge */}
              <div className="absolute top-4 right-4 bg-[#D4B038] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest shadow">
                COMING SOON
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
              <h2 className="text-2xl font-serif text-white mb-1">
                Scan
              </h2>

              <p className="text-xs text-white/70 mb-4">
                AI-powered image analysis
              </p>

              <button
                disabled
                className="w-full bg-gray-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center cursor-not-allowed"
              >
                <span className="text-sm uppercase tracking-widest">
                  Coming Soon
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OptionPopup;
