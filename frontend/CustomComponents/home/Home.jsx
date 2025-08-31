"use client";

import Image from "next/image";
import Footer from "../Footer/Footer";
import { useRouter } from "next/navigation";
import { useAmplitude } from "@/app/providers/amplitudeProvider";
import OptionPopup from "../Popups/OptionPopup"; // Import the new popup
import { useEffect, useState } from "react";
import { Api } from "@/shared/api/api";
import { categoryItemsData } from "@/mockData/homeMockData";
import { getRoutesForItem } from "@/config/routeConfig";
import SkinPopup from "../Popups/SkinPopup";
import { Lightbulb } from "lucide-react";

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [showOptionPopup, setShowOptionPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [category, setCategory] = useState("");
  const router = useRouter();
  const categoryItems = categoryItemsData;

  const { logEvent } = useAmplitude();

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
    <div className="h-screen bg-gray-50 max-w-md mx-auto flex flex-col justify-between">
      <div className="max-w-md mx-auto bg-white">
        <div className="relative w-[78px] h-[78px] mx-auto">
          <Image
            src={"/images/sagelogo2.png"}
            alt="sage"
            objectFit="contain"
            layout="fill"
          />
        </div>
        <p className="text-2xl font-bold text-center">Welcome to SageeAi</p>
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="mb-8">
            {/* Stats Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl px-2 py-4 border border-emerald-100 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 rounded-full p-1">
                  <div className="p-2 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Lightbulb color="white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-emerald-700 font-medium mb-1">
                    DID YOU KNOW?
                  </p>
                  {currentMessage && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold text-emerald-700">
                        {currentMessage?.split("%")[0]}%
                      </span>{" "}
                      {currentMessage?.split("%")[1]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-8">
            {categoryItems.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 text-gray-700">
                    <category.icon className="w-full h-full" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {category.title}
                  </h2>
                  {/* Visual indicator for popup categories */}
                  {shouldShowPopup(category.title) && (
                    <div className="bg-gradient-to-r from-[#D4B038] to-[#f4c842] text-white text-xs px-2 py-1 rounded-full font-medium">
                      Chat/Scan
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {category.items.map((item, itemIndex) => (
                    <button
                      onClick={() => handleCategoryClick(item, category.title)}
                      key={itemIndex}
                      className="group bg-white bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10 border border-gray-100 rounded-xl p-2 shadow-lg hover:border-[#D4B038]/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4B038] to-[#f4c842] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      {item.new && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-[#D4B038] to-[#f4c842] text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md animate-pulse duration-1000 ">
                          New
                        </div>
                      )}

                      <div className="w-10 h-10 p-2 mb-3 bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10 rounded-full flex items-center justify-center text-[#D4B038] group-hover:scale-110 transition-transform duration-300">
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
