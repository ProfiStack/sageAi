"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import WhyinvestData from "./whyInvestData";
import { useState } from "react";
import { cn } from "@/lib/utils";
export default function WhyInvest() {
  const { whyInvestData } = WhyinvestData();
  return (
    <div className="py-10 md:py-20 flex flex-col items-center  ">
      <div className="flex flex-col pb-10 md:w-[1100px] md:items-start items-center ">
        <div className="flex gap-1 text-[#014367]">
          <p className="md:text-[48px] text-[28px] font-normal">
            Why invest with{" "}
          </p>
          <p className="md:text-[48px] text-[28px] font-bold">Naimaat?</p>
        </div>
        <p className="md:text-[18px] text-[16px] font-normal md:text-start text-center text-[#545B79] ">
          Turn your blessings into opportunities—support visionary founders,
          expand your investments,
          <br className="md:flex hidden" /> and be part of a dynamic community
        </p>
      </div>
      <div className=" md:w-[1100px] flex flex-col md:flex-row  items-center gap-5">
        {whyInvestData.map((data) => (
          <div
            key={data.key}
            className=" group relative flex flex-col transition-all duration-300 w-[260px] h-[400px]  md:w-[330px] md:h-[500px] hover:w-[330px] md:hover:w-[500px]  ps-3 pe-3 md:ps-4 md:pe-10 hover:justify-center  justify-end leading-tight pb-20 md:pb-20  hover:pb-0 md:hover:pb-0   rounded-[20px]"
            style={{
              backgroundImage: `url('/images/gradient.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Image
              src={data.image}
              width={80}
              height={80}
              className="group-hover:absolute group-hover:top-6  pb-4"
            />
            <p className="text-white md:min-h-[120px] transition-all duration-150    group-hover:pt-20 group-hover:md:pt-0 group-hover:text-[28px] group-hover:font-bold group-hover:pb-2  md:group-hover:text-[38px] md:group-hover:font-extrabold  text-[18px]  md:text-[28px] font-semibold">
              {data.title}
            </p>
            <p
              className={cn(
                "text-white  opacity-0 absolute group-hover:relative  group-hover:opacity-100 text-[16px] font-normal  "
              )}
            >
              {data.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
