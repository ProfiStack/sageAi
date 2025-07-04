"use client";
import Footer from "@/CustomComponents/Footer/Footer";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import { Api } from "@/shared/api/api";
import useAuthStore from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const [htmlContent, setHtmlContent] = useState("");
  const chatId = searchParams.get("chatId");
  const params = useParams();
  const type = params.type;
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [formData, setFormData] = useState({
    skin_type: "",
    concern: "",
  });
  const { userId } = useAuthStore();
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await Api.client.getProfile(userId);
        if (profileData) {
          setFormData((prev) => ({
            ...prev,
            skin_type: profileData.skin_type || "",
            concern: profileData.concern || "",
          }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, [userId]);

  useEffect(() => {
    const results = async () => {
      try {
        setIsLoadingHistory(true);
        const resultData = await Api.client.getResults(userId, chatId);
        setHtmlContent(resultData.results);
        setIsLoadingHistory(false);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    results();
  }, [userId, chatId]);

  return (
    <div className="px-2 flex flex-col justify-between h-screen">
      <div>
        <SettingsHeader title={type?.toUpperCase()} />

        {formData.skin_type !== "Unknown" && formData.concern !== "Unknown" ? (
          <div className="ps-4">
            <p className="font-semibold text-[22px] text-[#0F1717] mt-3">
              {" "}
              Results Snapshot
            </p>
            <div className="flex items-center gap-3">
              <p className="flex items-center text-[#0F1717] bg-gray-200 px-4 py-2 rounded-[20px] font-semibold text-[14px] mt-2">
                {formData.skin_type.toUpperCase()}
              </p>
              <p className="flex items-center text-[#0F1717] bg-gray-200 px-4 py-2 rounded-[20px] font-semibold text-[14px] mt-2">
                {formData.concern.toUpperCase()}
              </p>
            </div>
          </div>
        ) : (
          <>
            {isAuthenticated ? (
              <div className="flex flex-col items-center justify-center mt-4">
                <p className="text-[18px] font-medium text-center text-[#0F1717]">
                  Please login and complete skin analysis quizz to see your
                  results
                </p>
                <button
                  className="mt-2 py-2 px-8 bg-[#02331E] text-white rounded-[20px] font-bold text-[14px]"
                  onClick={() => router.push("/chat")}
                >
                  {" "}
                  Take Quizz
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-4">
                <p className="text-[18px] font-medium text-center text-[#0F1717]">
                  Please login and complete skin analysis quizz to see your
                  results
                </p>
                <button
                  className="mt-2 py-2 px-8 bg-[#02331E] text-white rounded-[20px] font-bold text-[14px]"
                  onClick={() => router.push("/")}
                >
                  {" "}
                  Login
                </button>
              </div>
            )}
          </>
        )}
         {isLoadingHistory && <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
            <div className="text-gray-500">
              {"Loading chat results..."}
            </div>
          </div>
        </div>}
        {!isLoadingHistory && <div className="mt-8" dangerouslySetInnerHTML={{ __html: htmlContent }} />}
      </div>
      <Footer />
    </div>
  );
}
