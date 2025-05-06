"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Solutions() {
  return (
    <div className=" md:bg-[#02331ED9] py-10 mt-5">
      <div>
        <p className="font-bold text-[24px]  md:text-[36px] flex justify-center pb-4 text-center text-[#02331E] md:text-black">
          🔥 Find solutions for your specific needs
        </p>
      </div>

      <div className="flex justify-center items-center gap-10  ">
        <Carousel className="w-screen">
          <CarouselContent className="">
            {Array.from({ length: 4 }).map((_, index) => {
              return (
                <CarouselItem className="flex justify-center md:basis-1/2 lg:basis-1/3 xl:basis-1/4  ">
                  <div
                    className="w-[297px] h-[500px] bg-white rounded-xl  shadow-[0_14px_16px_rgba(0,0,0,0.1)] mb-1   "
                    key={index}
                  >
                    <div className="relative w-full h-[320px] ">
                      <Image
                        src="/images/routine.png"
                        objectFit="fill"
                        layout="fill"
                        className=" "
                      />
                    </div>
                    <div className="flex flex-col gap-y-3 px-3 rounded-t-xl bg-white -translate-y-10 ">
                      <div className="relative w-[30px] h-[36px] mt-6">
                        <Image
                          src="/images/bulb.png"
                          objectFit="cover"
                          layout="fill"
                        />
                      </div>
                      <p className="font-bold text-[20px] leading-none text-[#02331E] md:text-black">
                        Routine builder
                      </p>
                      <p className="text-[#4B5563]">
                        Is your skincare routine helping or hurting?
                      </p>
                      <button className="font-bold text-[#02331E] flex items-center gap-2">
                        Check now <ArrowRight size={20} color="#02331E" />{" "}
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselDots className="xl:hidden flex  " />
        </Carousel>
      </div>
    </div>
  );
}
