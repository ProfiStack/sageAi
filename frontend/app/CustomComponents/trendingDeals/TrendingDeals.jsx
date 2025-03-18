"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import HoverCard from "../cards/HoverCard";
import { forwardRef, useEffect, useState } from "react";
import { Api } from "@/shared/api/api";
const TrendingDeals = forwardRef((props, ref) => {
  const [startupData, setStartupData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.client.getStartups();
        setStartupData(response || []);
        s;
      } catch (error) {
        console.error("Error fetching startups data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full flex flex-col items-center gap-y-9 md:gap-y-0 "
    >
      <div className="flex md:w-[1150px] flex-col justify-start leading-tight md:leading-normal">
        <div className="flex items-center gap-2">
          <p className=" text-[48px] font-normal text-[#014367] leading-3">
            Trending{" "}
          </p>
          <p className=" text-[48px] font-bold text-[#014367]"> Deals</p>
        </div>
        <p className="text-[#545B79] mb-5">
          The deals getting the most traction right now
        </p>
      </div>

      {/* Carousel Component */}
      <Carousel className=" flex mb-10 justify-center ">
        <div className="relative flex justify-center items-center w-1/4 md:w-[1200px]">
          <div className=" absolute top-2 md:top-0 right-48  md:right-28 -translate-y-12  flex gap-8    mb-4">
            <div className="flex gap-x-3">
              <button
                type="button"
                className="text-[16px] font-medium text-[#124074]"
              >
                see all {"("}10{")"}
              </button>
              <div>
                <CarouselPrevious className="!left-auto text-[#124074]" />
              </div>
            </div>
            <div>
              <CarouselNext className="!left-auto text-[#124074]" />
            </div>
          </div>
          <CarouselContent className="flex  w-auto ml-0">
            {startupData.map((startUp, index) => (
              <CarouselItem
                key={index}
                className="  flex justify-center items-center gap-10 basis-full lg:basis-1/3 md:basis-1/3"
              >
                <HoverCard className="shadow-none" startupData={startUp} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
    </div>
  );
});
export default TrendingDeals;
