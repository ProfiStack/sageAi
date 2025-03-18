"use client ";

import { useState } from "react";
import Image from "next/image";
import CompletionBar from "../completionBar/CompletionBar";
import { cn } from "@/lib/utils";
import Link from "next/link";
export default function HoverCard({ startupData, className }) {
  const [isHovered, setIsHovered] = useState(false);
  const completionPercentage =
    (startupData.moneyRaised / startupData.moneyToBeRaised) * 100;
  return (
    <Link
      href={`/startup/details/${startupData.id}`}
      className={cn(
        "h-[500px]   overflow-hidden  rounded-[25px] shadow-lg bg-white border border-gray-200 w-[376px]  ",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("w-full relative transition-all")}>
        <div className="relative w-[376px] h-[255px]">
          <Image
            objectFit="contain"
            layout="fill"
            src={startupData?.titleImage}
            alt="bgimg"
          />
        </div>
        <Image
          width={60}
          height={60}
          src={startupData?.logo}
          alt="logo"
          className={cn(
            " rounded-[20px] absolute  bottom-0 left-7  flex justify-center transition-all z-10 ",
            isHovered ? "-translate-y-16" : "translate-y-4"
          )}
        />
      </div>
      <div
        className={cn(
          "px-6 transition-all bg-white",
          isHovered ? " -translate-y-28" : "translate-y-0"
        )}
      >
        <div
          className={cn(
            "transition-all text-[16px] md:text-[24px] font-bold mt-[20px] ",
            isHovered && "pt-8"
          )}
        >
          {startupData?.companyName}
        </div>

        <p className=" text-[#666] font-normal text-[14px] leading-6 h-[78px]    ">
          {startupData?.description}
        </p>
        <div
          className={cn(
            "flex justify-between font-semibold  pb-1   ",
            isHovered ? "text-[14px]" : "text-[10px]"
          )}
        >
          <p>${startupData.moneyRaised} raised</p>
          <p className="text-[#34C759CC] bg-[#def7e5] rounded-[15px]  px-[6px]   ">
            {completionPercentage.toFixed(0)}%{" "}
          </p>
        </div>
        <CompletionBar
          completionPercentage={completionPercentage}
          className={isHovered ? "h-[10px]" : "h-[7px]"}
        />
        {!isHovered && (
          <div className="flex flex-col gap-2 pt-4">
            <p className="text-[16px] text-[#999] font-normal">Dubai,UAE</p>

            <p className="text-[10px] font-bold text-[#4D4D4D] bg-[#E6E6E6] rounded-[3px] p-1 w-max">
              {startupData.industry}
            </p>
          </div>
        )}
        {isHovered && (
          <div className="space-y-2 pt-4">
            <div className="flex gap-x-4">
              <div className="flex flex-1 flex-col bg-[#8DA9C4] text-white rounded-[16px] px-3 py-2 leading-tight">
                <p className="text-[20px] font-bold">400</p>
                <p className="text-[15px] font-normal">Investors</p>
              </div>
              <div className="flex flex-col flex-1 bg-[#B3DADEBF] text-[#014367] rounded-[16px] px-3 py-2 leading-tight">
                <p className="text-[20px] font-bold">$100</p>
                <p className="text-[15px] font-normal">Min. Investment</p>
              </div>
            </div>
            <div className=" bg-[#EEF4ED] text-[#014367] rounded-[16px] px-3 py-2 leading-tight">
              <p className="text-[20px] font-bold">
                ${startupData?.moneyToBeRaised}
              </p>
              <p className="text-[15px] font-normal">Fund Needed</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
