"use client";

import { useEffect, useState } from "react";
import { Api } from "@/shared/api/api";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";

const typeLabels = {
  skincare: "Skincare",
  trend_analysis: "Trend Analysis",
  ingredient_checker: "Ingredient Checker",
  treatment_planning: "Skin Treatment",
};

const ChatButtons = () => {
  const { userId } = useAuthStore();
  const [buttons, setButtons] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!userId) {
          return;
        }
        const data = await Api.client.getAllChatHistory(userId); // 🔁 Replace with actual API

        if (data?.history?.length) {
          // Map types to chat IDs (one per type)
          const typeMap = {};
          data.history.forEach((item) => {
            if (!typeMap[item.type]) {
              typeMap[item.type] = {
                label: typeLabels[item.type] || item.type,
                chatId: item.id,
              };
            }
          });

          setButtons(
            Object.entries(typeMap).map(([type, value]) => ({
              type,
              ...value,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    fetchChats();
  }, [userId]);

  const handleClick = async (type, chatId) => {
    router.push(`/result/${type}?chatId=${chatId}`);
  };

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {buttons.map(({ type, label, chatId }) => (
        <button
          key={type}
          onClick={() => handleClick(type, chatId)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ChatButtons;
