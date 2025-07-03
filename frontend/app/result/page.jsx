"use client";
import Footer from "@/CustomComponents/Footer/Footer";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import { Api } from "@/shared/api/api";
import useAuthStore from "@/store/authStore";
import { Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
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

  return (
    <div className="px-2 flex flex-col justify-between h-screen">
      <div>
        <SettingsHeader title={"Analysis Results"} />

        {formData.skin_type !== "Unknown" && formData.concern !== "Unknown" ? (
          <div className="ps-4">
            <p className="font-semibold text-[22px] text-[#0F1717] mt-3">
              {" "}
              Skin Snapshot
            </p>
            <div className="flex items-center gap-3">
              <p className="flex items-center text-[#0F1717] bg-gray-200 px-4 py-2 rounded-[20px] font-semibold text-[14px] mt-2">
                {formData.skin_type}
              </p>
              <p className="flex items-center text-[#0F1717] bg-gray-200 px-4 py-2 rounded-[20px] font-semibold text-[14px] mt-2">
                {formData.concern}
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
      </div>
      <Footer />
    </div>
  );
}
