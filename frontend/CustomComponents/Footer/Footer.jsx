"use client";
import {
  House,
  UserRound,
  MessageCircleMore,
  TvMinimalPlay,
  ScanFace,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ScanPopup from "../Popups/ScanPopup";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  const footerData = [
    { icon: House, route: "/home", title: "Home" },
    { icon: MessageCircleMore, route: "/chat", title: "Chat" },
    { icon: ScanFace, route: "/image-analysis", title: "Scan" },
    { icon: TvMinimalPlay, route: "/result", title: "Results" },
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
    <div className="py-2 sticky inset-0  bg-white border-t border-gray-200">
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
                  ? "text-[#121712]"
                  : "text-[#5C8A63] hover:text-[#121712]"
              }`}
            >
              <div className={` rounded-full transition-all duration-200 `}>
                <IconComponent
                  size={24}
                  color={isActive ? "#121712" : "#5C8A63"}
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
