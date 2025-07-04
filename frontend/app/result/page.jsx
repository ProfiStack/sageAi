"use client";

import { useEffect, useState } from "react";
import { Api } from "@/shared/api/api";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/CustomComponents/Footer/Footer";
import { resultPageData } from "@/mockData/homeMockData";
import CategoryCard from "@/CustomComponents/home/categoryCard/CategoryCard";
import { mergeChatIdIntoMockData } from "@/shared/api/utils";

const SectionHeader = ({ title }) => (
  <h2 className="text-lg font-bold text-gray-900 mb-4 px-4">{title}</h2>
);
const ChatButtons = () => {
  const { userId } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState({
    main: [],
    insights: [],
    professional: [],
    otherCategories: [],
  });

  useEffect(() => {
    const fetchChats = async () => {
      if (!userId) return;

      try {
        const response = await Api.client.getAllChatHistory(userId);
        const history = response?.history || [];
        console.log(history);
        const updated = mergeChatIdIntoMockData(resultPageData, history);
        setData(updated);
        console.log(data)
        // Create a map: type => chatId
       
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    fetchChats();
  }, [userId]);

  const handleCategoryClick = (item) => {
    console.log(item);
    if (item.chatId && item.id) {
      router.push(`/result/${item.id}?chatId=${item.chatId}`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="relative w-[78px] h-[78px] mx-auto">
          <Image
            src="/images/sagelogo2.png"
            alt="sage"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <p className="text-2xl font-bold text-center">Sage Results</p>

        {/* Main Section */}
        {data.main.length > 0 && (
          <div className="pt-6 pb-4">
            <SectionHeader title="SkinCare" />
            <div className="px-4 space-y-3">
              {data.main.map((item) => (
                <CategoryCard
                  key={item.id}
                  item={item}
                  onClick={() => handleCategoryClick(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Insights Section */}
        {data.insights.length > 0 && (
          <div className="py-4">
            <SectionHeader title="Insights" />
            <div className="px-4 space-y-3">
              {data.insights.map((item) => (
                <CategoryCard
                  key={item.id}
                  item={item}
                  onClick={() => handleCategoryClick(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Professional Section */}
        {data.professional.length > 0 && (
          <div className="py-4">
            <SectionHeader title="Professional" />
            <div className="px-4 space-y-3">
              {data.professional.map((item) => (
                <CategoryCard
                  key={item.id}
                  item={item}
                  onClick={() => handleCategoryClick(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Categories Section */}
        {data.otherCategories.length > 0 && (
          <div className="py-4 pb-8">
            <SectionHeader title="Other Categories" />
            <div className="px-4 space-y-3">
              {data.otherCategories.map((item) => (
                <CategoryCard
                  key={item.id}
                  item={item}
                  onClick={() => handleCategoryClick(item)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ChatButtons;
