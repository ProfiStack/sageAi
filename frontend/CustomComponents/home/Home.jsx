"use client";

import Image from "next/image";
import Footer from "../Footer/Footer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Api } from "@/shared/api/api";
import { Lightbulb } from "lucide-react";
import useAuthStore from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound } from "lucide-react";
import { LogIn } from "lucide-react";
import { UserPlus } from "lucide-react";
import { categories } from "@/mockData/homeMockData";
import HomeCard from "./homeCard/HomeCard";

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);



  const router = useRouter();
  
  const {
    token,
    isFreeScan,
    shadeMatching,
    skinAnalysis,
    name,
    isAuthenticated,
  } = useAuthStore();

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
    <div className="h-screen bg-[#fafafa] flex flex-col ">
          <div className="bg-[#fafafa] rounded-[16px] shadow-lg p-4 my-4 ">
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
                  <DropdownMenuContent className="bg-white mr-4">
                    <DropdownMenuLabel>
                      <button
                        className="flex items-center gap-2 bg-[#02331E] rounded-xl  text-white w-full p-2"
                        onClick={() => router.push("/login")}
                      >
                        <LogIn size={20} /> Login
                      </button>
                    </DropdownMenuLabel>
                    <DropdownMenuLabel>
                      <button
                        className="flex items-center gap-2 bg-[#D4B038] rounded-xl  text-white w-full p-2"
                        onClick={() => router.push("/signup")}
                      >
                        <UserPlus size={20} /> Signup
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

         
          <div className="flex-1 flex flex-col gap-4 px-6 py-6 overflow-hidden">
  {categories.map((item) => (
    <HomeCard key={item.id} item={item} />
  ))}

    </div>

          
      <Footer />

    </div>
  );
}
