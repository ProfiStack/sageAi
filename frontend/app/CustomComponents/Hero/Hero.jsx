"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
export default function Hero() {
  return (
    <div className="flex justify-between  ">
      <div className="relative w-[200px] h-[400px] lg:w-[240px] lg:h-[430px] xl:w-[303px] xl:h-[517px] ">
        <Image src="/images/faceScan.png" objectFit="cover" layout="fill" />
      </div>
      <div className="flex flex-col items-center justify-center text-[#02331E]">
        <div className="relative flex items-center justify-center ">
          <p className=" text-[40px] lg:text-[50px] xl:text-[60px] font-semibold xl:font-bold text-center leading-tight  ">
            Dermatologist verified <br /> precision
          </p>
          <Image
            src="/images/star.png"
            className="absolute right-[100px] bottom-2 lg:right-[130px] lg:bottom-4 xl:right-[157px]   xl:bottom-5    "
            width={23}
            height={33}
          />
        </div>
        <div className=" flex items-center gap-4">
          <p className="text-[40px] xl:text-[60px] font-medium  lg:font-semibold ">
            Get a{" "}
          </p>
          <p className="text-[40px] xl:text-[60px] font-medium lg:font-semibold underline decoration-2 underline-offset-8 ">
            science backed
          </p>
        </div>
        <p className="text-[40px] xl:text-[60px] font-medium lg:font-semibold leading-tight">
          {" "}
          routine in
        </p>
        <p className="text-[40px] xl:text-[60px] font-semibold xl:font-bold leading-tight">
          60 Seconds!
        </p>
        <p className="text-[20px] font-normal text-[#4B5563]">
          Personalised to your unique skin
        </p>
        <div className="flex items-center justify-center py-3 px-5 rounded-full   bg-[#02331E] gap-3 mt-6">
          <button className="text-2xl font-medium text-white">
            Get My Free Skin Analysis
          </button>
          <ArrowUpRight className="bg-white rounded-full" />
        </div>
      </div>
      <div className="relative w-[200px] h-[400px] lg:w-[240px] lg:h-[430px] xl:w-[303px] xl:h-[517px]">
        <Image src="/images/faceScan2.png" objectFit="cover" layout="fill" />
      </div>
    </div>
  );
}
