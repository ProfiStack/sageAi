"use client";
import { House, UserRound, ScanFace, MessageSquare } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ScanPopup from "../Popups/ScanPopup";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  const footerData = [
    { icon: House, route: "/", title: "Home" },
    { icon: MessageSquare, route: "/skincare/chat", title: "Chat" },
    { icon: ScanFace, route: "/image-analysis", title: "Scan" },
    // { icon: TvMinimalPlay, route: "/result", title: "Results" },
    { icon: UserRound, route: "/profile", title: "Profile" },
  ];

  const handleOnClick = (route) => {
    if (route === "/image-analysis") {
      setIsOpen(true);
    } else {
      router.push(route);
    }
  };

  return (
    <div className="py-2 sticky inset-0  bg-[#02331E] border-t border-gray-200 rounded-t-2xl">
      <div className="flex justify-around">
        {footerData.map((data, index) => {
          const isActive = pathName === data.route;
          const IconComponent = data.icon;

          return (
            <button
              key={index}
              onClick={() => handleOnClick(data.route)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-[#D4B038]"
                  : "text-white hover:text-[#D4B038]"
              }`}
            >
              <div className={` rounded-full transition-all duration-200 `}>
                <IconComponent
                  size={24}
                  color={isActive ? "#D4B038" : "#f6f6f6"}
                />
              </div>
              <p
                className={`text-xs mt-1 transition-all duration-200 ${
                  isActive ? "font-semibold" : "font-normal"
                }`}
              >
                {data.title}
              </p>
            </button>
          );
        })}
      </div>
      <ScanPopup isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
