"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
export default function Hero() {
  return (
    <div>
      <div className="flex justify-between  ">
        <div className="relative w-[200px] h-[400px] lg:w-[240px] lg:h-[430px] xl:w-[303px] xl:h-[517px] hidden md:flex ">
          <Image src="/images/faceScan.png" objectFit="cover" layout="fill" />
        </div>
        <div className="flex flex-col items-center justify-center text-[#02331E] container ms-auto">
          <div className="relative flex items-center justify-center ">
            <p className="text-[24px] md:text-[40px] lg:text-[50px] xl:text-[60px] font-bold text-center leading-tight  ">
              Dermatologist <br className="flex md:hidden" /> verified <br />{" "}
              <span className="md:flex hidden justify-center">precision</span>
            </p>
            <span className=" w-[18px] h-[18px] md:w-[33px] md:h-[33px] absolute  right-[22px] top-9 md:top-auto lg:top-auto xl:top-auto  md:right-[90px] md:bottom-2 lg:right-[120px] lg:bottom-4 xl:right-[150px]   xl:bottom-5    ">
              <Image src="/images/star.png" objectFit="contain" layout="fill" />
            </span>
          </div>
          <div className=" flex items-center gap-1 md:gap-4 ">
            <p className="text-[24px] md:text-[40px] xl:text-[60px] font-semibold ">
              Get a{" "}
            </p>
            <p className="text-[24px] md:text-[40px] xl:text-[60px] font-semibold">
              <span className="underline decoration-2 underline-offset-2 md:underline-offset-8 inline">
                science <span className="hidden md:inline">backed</span>
              </span>
            </p>
          </div>
          <p className="text-[24px] md:text-[40px] xl:text-[60px] font-semibold underline decoration-2 underline-offset-2 md:underline-offset-8 flex md:hidden">
            Backed
          </p>
          <p className="text-[24px] md:text-[40px] xl:text-[60px] font-semibold leading-tight">
            {" "}
            routine in
          </p>
          <p className="text-[24px] md:text-[40px] xl:text-[60px] font-semibold xl:font-bold leading-tight">
            60 Seconds!
          </p>
          <p className="md:flex hidden text-[14px] md:text-[20px] font-normal text-[#4B5563]">
            Personalised to your unique skin
          </p>
          <div className="hidden md:flex items-center justify-center py-3 px-5 rounded-full    bg-[#02331E] gap-3 mt-6">
            <button className="text-2xl font-medium text-white">
              Get My Free Skin Analysis
            </button>
            <ArrowUpRight className="bg-white rounded-full" />
          </div>
        </div>
        <div className="relative w-[141px] h-[181px] md:w-[200px] md:h-[400px] lg:w-[240px] lg:h-[430px] xl:w-[303px] xl:h-[517px]">
          <Image src="/images/faceScan2.png" objectFit="cover" layout="fill" />
        </div>
      </div>
      <p className="flex md:hidden justify-center items-center mt-2 text-[14px] md:text-[20px] font-normal text-[#4B5563]">
        Personalised to your unique skin
      </p>
      <div className=" items-center justify-center py-2 px-2 rounded-full  flex md:hidden  bg-[#02331E] gap-3 mt-1 mx-10">
        <button className="text-[18px] font-medium text-white">
          Get My Free Skin Analysis
        </button>
        <ArrowUpRight className="bg-white rounded-full" />
      </div>
    </div>
  );
}
