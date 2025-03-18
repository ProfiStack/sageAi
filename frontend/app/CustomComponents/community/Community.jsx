"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import InvestorsCard from "./components/InvestorsCard";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Community() {
  const [isTabTrigger, setIsTabTrigger] = useState("Investors");

  return (
    <div className="pb-20 bg-[#F3F4F6]   ">
      <div className="h-[250px] md:h-[600px] ">
        <div>
          <p className="text-center text-[18px] md:text-[40px] font-bold text-[#014367]">
            Hear from the community
          </p>
        </div>
        <div>
          <Tabs
            defaultValue="Investors"
            className="w-auto flex flex-col items-center mt-5 md:mt-10 "
          >
            <TabsList className="flex gap-2 md:gap-40 mb-6 ">
              <TabsTrigger
                onClick={() => setIsTabTrigger("Investors")}
                value="Investors"
              >
                <div className="flex flex-col gap-3">
                <div
                  className={cn(
                    "flex items-center gap-2 text-[14px] md:text-[30px] font-bold",
                    isTabTrigger === "Investors" && "text-[#14315D]"
                  )}
                >
                  <Image
                    width={30}
                    height={30}
                    src={'/images/investorIcon.png'}
                    alt="image"
                  />

                  <p>Investors</p>
                </div>
               {isTabTrigger === "Investors" && <hr className="w-full border-2 rounded-t-3xl  border-[#14315d] " />}
                </div>
              </TabsTrigger>

              <TabsTrigger
                onClick={() => setIsTabTrigger("Founders")}
                value="Founders"
              >
                <div className="flex flex-col gap-3">
                <div
                  className={cn(
                    "flex items-center gap-2 text-[14px] md:text-[30px] font-bold",
                    isTabTrigger === "Founders" && "text-[#14315D]"
                  )}
                >
                  <Image width={30} height={30} src={'/images/Bulb.png'} alt="image" />

                  <p>Founders</p>
                </div>
               {isTabTrigger === "Founders" && <hr className="w-full border-2 rounded-t-3xl  border-[#14315d]"/>} 
                </div>
              </TabsTrigger>

              <TabsTrigger onClick={() => setIsTabTrigger("VCs")} value="VCs">
                <div className="flex flex-col gap-3">
                <div
                  className={cn(
                    "flex items-center gap-2 text-[14px] md:text-[30px] font-bold",
                    isTabTrigger === "VCs" && "text-[#14315D]"
                  )}
                >
                  <Image width={30} height={30} src={'/images/moneyIcon.png'} alt="image" />

                  <p>VCs</p>
                </div>
              {isTabTrigger === "VCs"&& <hr className="w-full border-2 rounded-t-3xl  border-[#14315d]"/>}  
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={isTabTrigger} className="w-full flex justify-center px-2">
              {isTabTrigger === "Investors" && <InvestorsCard />}
              {isTabTrigger === "Founders" && <InvestorsCard />}
              {isTabTrigger === "VCs" && <InvestorsCard />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
