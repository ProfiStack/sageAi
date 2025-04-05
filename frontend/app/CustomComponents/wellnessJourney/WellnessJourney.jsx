import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function WellnessJourney() {
  return (
    <div className="bg-none md:bg-[#D4B038B3] my-10 py-5">
      <p className="flex justify-center text-[36px] font-bold mb-4 text-center leading-none md:leading-normal text-[#02331E] md:text-black ">
        Your complete wellness journey coming soon{" "}
      </p>
      <div className="flex items-center justify-center ">
        <Carousel className="w-screen">
          <CarouselContent>
            {Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem className="relative flex justify-center md:basis-1/2 lg:basis-1/3 ">
                <div
                  className="relative w-[294px] h-[347px] px-2 rounded-2xl shadow-[0px_6px_6px_rgb(0,0,0,0.1)] bg-white mb-1  "
                  key={index}
                >
                  <div className=" flex flex-col items-center gap-3">
                    <div className="relative w-[294px] h-[130px]">
                      <Image
                        src="/images/makeup.png"
                        objectFit="cover"
                        layout="fill"
                        className="rounded-t-2xl"
                      />
                    </div>
                    <p className="font-bold">Make up</p>
                    <p className="font-medium text-[#4B5563] px-6 text-center">
                      Colour matches How to apply makeup{" "}
                    </p>
                  </div>
                  <div className="flex justify-end mt-16">
                    <button className="font-bold text-[#02331E] flex ">
                      Sign up to get notified <ArrowRight />
                    </button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselDots className="flex lg:hidden  " />
        </Carousel>
      </div>
    </div>
  );
}
