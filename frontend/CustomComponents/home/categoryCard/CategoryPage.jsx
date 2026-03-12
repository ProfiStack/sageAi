'use client'

import Footer from "@/CustomComponents/Footer/Footer";
import OptionPopup from "@/CustomComponents/Popups/OptionPopup";
import SkinPopup from "@/CustomComponents/Popups/SkinPopup";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { usePostHog } from "@/app/providers/posthogProvider";

export default function CategoryPage({
  title,
  pageData = [],
  popupCategories = ["Skincare", "Makeup","MedTech"],
}) {
  const [showOptionPopup, setShowOptionPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const router = useRouter();
  const { logEvent } = usePostHog();



  const shouldShowPopup = (categoryTitle) =>
    popupCategories.includes(categoryTitle);

  const handleCategoryClick = (item, categoryTitle) => {
// logEvent("Home Option Selected", {
      // item_title: item.title,
     //});

    if (shouldShowPopup(categoryTitle)) {
      setSelectedItem(item);
      setShowOptionPopup(true);
    } else {
      router.push(item.route);
    }
  };

  const handleChatClick = (item) => {
    router.push(item.route);
    setShowOptionPopup(false);
  };

  const handleScanClick = (item) => {
    if (item.scanRoute && item.scanRoute !== "/none") {
      router.push(item.scanRoute);
      setShowOptionPopup(false);
    }
  };

  const handleClosePopup = () => {
    setShowOptionPopup(false);
    setSelectedItem(null);
  };

  // Default tab = first category
  const defaultTab = pageData[0]?.title ?? "";

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <SettingsHeader title={title} />

      <div className="flex-1 flex flex-col">
        <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col">
          {/* ── Tab bar ── */}
          <div className="sticky top-0  bg-[#fafafa] border-b border-gray-100 px-3 pt-3">
            <TabsList className="flex gap-1 overflow-x-auto scrollbar-none h-auto bg-transparent p-0 justify-start w-full">
              {pageData.map((category) => (
                <TabsTrigger
                  key={category.title}
                  value={category.title}
                  className={cn(
                    "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                    "text-gray-500 bg-white border border-gray-200 shadow-sm",
                    "data-[state=active]:bg-[#02331E] data-[state=active]:text-white",
                    "data-[state=active]:border-[#02331E] data-[state=active]:shadow-md",
                    "hover:border-[#D4B038]/50 ",
                  )}
                >
                  {category.title}
                  {/* dot indicator for popup categories */}
                  {shouldShowPopup(category.title) && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#D4B038]" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* ── Tab panels ── */}
          {pageData.map((category) => (
            <TabsContent
              key={category.title}
              value={category.title}
              className="flex-1 p-3 mt-0 outline-none"
            >
              {/* Section header */}
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold text-[#02331E]">
                  {category.title}
                </h2>
                {shouldShowPopup(category.title) && (
                  <span className="bg-gradient-to-r from-[#D4B038] to-[#f4c842] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    Chat/Scan
                  </span>
                )}
                <span className="ml-auto text-xs text-gray-400 font-medium">
                  {category.items.length} FEATURES
                </span>
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                {category.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => handleCategoryClick(item, category.title)}
                    className="group flex gap-x-2 bg-white border border-gray-100 rounded-xl p-3 shadow-lg hover:border-[#D4B038]/30 transition-all duration-300 hover:-translate-y-1 relative text-left"
                  >
                    {item.new && (
                      <div className="absolute -top-2 right-2 bg-gradient-to-r from-[#D4B038] to-[#f4c842] text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md animate-pulse">
                        New
                      </div>
                    )}

                    <div
                      className={cn(
                        "w-10 h-10 p-2 rounded-[8px] flex items-center justify-center text-black group-hover:scale-110 transition-transform duration-300 shrink-0",
                        item.bg,
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>

                    <div>
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
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Footer />

      {/* Popups */}
      {selectedItem?.scanRoute === "/none" ? (
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