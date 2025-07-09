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
import useFormToast from "@/CustomComponents/FormToast/FormToast";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";

const SectionHeader = ({ title }) => (
  <h2 className="text-lg font-bold text-gray-900 mb-4 px-4">{title}</h2>
);
const ChatButtons = () => {
  const { destructiveToast } = useFormToast();
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
        const updated = mergeChatIdIntoMockData(resultPageData, history);
        setData(updated);
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
    } else {
      destructiveToast("No results found");
    }
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="h-screen bg-gray-50 max-w-md mx-auto flex flex-col justify-between">
        <div className="max-w-md mx-auto bg-[#fdfdfd] min-h-screen">
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
            <div className="pt-6 pb-4 ">
              <SectionHeader title="Consultant chat" />
              <p className="px-5 py-2">
                Based on your chat with our consultant, here are some key
                takeaways and recommendations:
              </p>
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
              <SectionHeader title="Trend Analysis" />
              <p className="px-5 py-2">
                Our trend analysis reveals the following insights relevant to
                your preferences:
              </p>
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
              <SectionHeader title="Treatment Planning" />
              <p className="px-5 py-2">
                Based on your analysis, here's a suggested treatment plan:
              </p>
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
              <SectionHeader title="Ingredients analyser" />
              <p className="px-5 py-2">
                The ingredients analyzer has identified the following matches
                and mismatches for your skin type:
              </p>
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
    </ProtectedRoute>
  );
};

export default ChatButtons;
