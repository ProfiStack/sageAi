"use client";

import Image from "next/image";
import Footer from "../Footer/Footer";
import { useRouter } from "next/navigation";
import { usePostHog } from "@/app/providers/posthogProvider";
import OptionPopup from "../Popups/OptionPopup"; // Import the new popup
import { useEffect, useState } from "react";
import { Api } from "@/shared/api/api";
import { categoryItemsData } from "@/mockData/homeMockData";
import { getRoutesForItem } from "@/config/routeConfig";
import SkinPopup from "../Popups/SkinPopup";
import { Lightbulb } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound } from "lucide-react";

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [showOptionPopup, setShowOptionPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [category, setCategory] = useState("");
  const router = useRouter();
  const categoryItems = categoryItemsData;
  const {
    token,
    isFreeScan,
    shadeMatching,
    skinAnalysis,
    name,
    isAuthenticated,
  } = useAuthStore();

  const { logEvent } = usePostHog();
  useEffect(() => {
    const getProfile = async () => {
      const res = await Api.client.getProfile(token);
      const skinAnalysis = res?.payment_types?.includes("skin-analysis");
      const shadeMatching = res?.payment_types?.includes("shade-matching");
      const store = useAuthStore?.getState();
      store?.setFreeScan(res?.free_scan);
      store?.setShadeMatching(shadeMatching);
      store?.setSkinAnalysis(skinAnalysis);
    };
    getProfile();
  }, [token, isFreeScan, shadeMatching, skinAnalysis]);

  // Categories that should show the popup (chat/scan options)
  const popupCategories = ["Skincare", "Makeup"];

  // Function to check if a category should show popup
  const shouldShowPopup = (categoryTitle) => {
    return popupCategories.includes(categoryTitle);
  };

  const handleCategoryClick = (item, categoryTitle) => {
    logEvent("Home Section Clicked", {
      click_value: item.title,
    });

    // Check if this category should show popup
    if (shouldShowPopup(categoryTitle)) {
      setCategory(categoryTitle);
      // Set the selected item and show the popup for Skincare/Makeup
      setSelectedItem(item);
      setShowOptionPopup(true);
    } else {
      // Direct navigation for other categories (Nutrition, Styling, Hair Care, Wellness)
      router.push(item.route);

      logEvent("Direct Navigation", {
        item_title: item.title,
        category: categoryTitle,
        route: item.route,
      });
    }
  };

  const handleChatClick = (item) => {
    const routes = getRoutesForItem(item.route);
    router.push(routes.chat);
    setShowOptionPopup(false);

    logEvent("Chat Option Selected", {
      item_title: item.title,
      route: routes.chat,
    });
  };

  const handleScanClick = (item) => {
    const routes = getRoutesForItem(item.route);

    logEvent("Scan Option Selected", {
      item_title: item.title,
      route: routes.scan,
    });
  };

  const handleClosePopup = () => {
    setShowOptionPopup(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    const getStaticList = async () => {
      const response = await Api.client.getMessages();
      setMessages(response?.message);
      setCurrentMessage(response?.message[0]?.message);
    };

    getStaticList();
  }, []);

  useEffect(() => {
    if (messages?.length) {
      const changeMessage = () => {
        const randomIndex = Math.floor(Math.random() * messages?.length);
        setCurrentMessage(messages[randomIndex].message);
      };
      const intervalId = setInterval(changeMessage, 5000);
      return () => clearInterval(intervalId);
    }
  }, [messages]);

  return (
    <div className="h-screen bg-[#F5F5F5] max-w-md mx-auto flex flex-col justify-between">
      <div className="max-w-md mx-auto bg-white mb-4">
        <div>
          <div className="bg-white rounded-[16px] shadow-lg p-4 my-4 ">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[20px] font-semibold">
                  Welcome {isAuthenticated && name ? name : "Guest user"}
                </p>
                <h2 className="text-[13px] text-[#525252]">
                  Here’s your beauty & wellness hub.
                </h2>
              </div>

              {isAuthenticated ? (
                <div className="flex justify-end ">
                  <div className="relative w-[40px] h-[40px]">
                    <Image
                      src="/images/sagelogo.png"
                      alt="sage"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <CircleUserRound />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white">
                    <DropdownMenuLabel>
                      <button onClick={() => router.push("/login")}>
                        Login
                      </button>
                    </DropdownMenuLabel>
                    <DropdownMenuLabel>
                      <button onClick={() => router.push("/signup")}>
                        Signup
                      </button>
                    </DropdownMenuLabel>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="max-w-md mx-auto  pt-4">
              <div className="">
                {/* Stats Card */}
                <div className="bg-[rgba(2,51,30,0.05)] rounded-2xl px-2 py-4 border border-[#02331E26]   shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#02331E] rounded-[8px] p-1">
                      <div className=" bg-[#02331E] rounded-[8px] flex items-center justify-center">
                        <Lightbulb color="white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#02331E] font-medium mb-1">
                        DID YOU KNOW?
                      </p>
                      {currentMessage && (
                        <p className="text-[#404040] text-sm leading-relaxed">
                          <span className="font-semibold text-[#404040]">
                            {currentMessage?.split("%")[0]}%
                          </span>{" "}
                          {currentMessage?.split("%")[1]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-8 px-2">
            {categoryItems.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-[#02331E]">
                    {category.title}
                  </h2>
                  {/* Visual indicator for popup categories */}
                  {shouldShowPopup(category.title) && (
                    <div className="bg-gradient-to-r from-[#D4B038] to-[#f4c842] text-white text-xs px-2 py-1 rounded-full font-medium">
                      Chat/Scan
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                  {category.items.map((item, itemIndex) => (
                    <button
                      onClick={() => handleCategoryClick(item, category.title)}
                      key={itemIndex}
                      className="group flex gap-x-2 bg-white  border border-gray-100 rounded-xl p-3 shadow-lg hover:border-[#D4B038]/30 transition-all duration-300 hover:-translate-y-1 relative "
                    >
                      {item.new && (
                        <div className="absolute top-0  -translate-y-2 right-2 bg-gradient-to-r from-[#D4B038] to-[#f4c842] text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md animate-pulse duration-1000 ">
                          New
                        </div>
                      )}

                      <div
                        className={cn(
                          "w-10 h-10 p-2   rounded-[8px] flex items-center justify-center text-black group-hover:scale-110 transition-transform duration-300",
                          item.bg
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>

                      <div className="text-left">
                        <h3 className="font-semibold text-[#02331E] text-sm leading-tight mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-tight">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />

      {/* Popups */}
      {selectedItem?.scanRoute === "/product-analysis" ||
      selectedItem?.scanRoute === "/none" ? (
        <OptionPopup
          isOpen={showOptionPopup}
          onClose={handleClosePopup}
          selectedItem={selectedItem}
          onChatClick={handleChatClick}
          onScanClick={handleScanClick}
        />
      ) : (
        <SkinPopup
          isOpen={showOptionPopup}
          onClose={handleClosePopup}
          selectedItem={selectedItem}
          onChatClick={handleChatClick}
        />
      )}
    </div>
  );
}
