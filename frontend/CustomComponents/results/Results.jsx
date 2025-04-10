import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";
import Image from "next/image";
export default function Results() {
  return (
    <div className="my-16 container mx-auto">
      <p className="md:flex hidden justify-center text-[24px] text-center md:text-[36px] font-bold">
        Real results, real people
      </p>
      <p className="md:hidden flex justify-center text-[24px] text-center text-[#02331E] md:text-black font-bold ">
        What Our Users Say
      </p>

      <div className="flex justify-center">
        <Carousel className="w-screen">
          <CarouselContent>
            {Array.from({ length: 3 }).map((_, index) => {
              return (
                <CarouselItem className="md:basis-1/2 lg:basis-1/3 flex justify-center ">
                  <div
                    key={index}
                    className="w-[394px] shadow-[0px_18px_20px_rgb(0,0,0,0.1)] rounded-2xl my-10 px-5 py-5 space-y-5"
                  >
                    <div className="flex gap-2 items-center">
                      <div className="relative w-[48px] h-[48px]">
                        <Image
                          src="/images/rating.png"
                          objectFit="cover"
                          layout="fill"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-bold">Sarah Johnson</p>
                        <div className="flex">
                          {Array.from({ length: 4 }).map((_, index) => (
                            <div>
                              <Star fill="#D4B038" color="#D4B038" size={16} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-[#4B5563]">
                      "This quiz changed my skincare game completely! The
                      personalized recommendations were spot-on."
                    </p>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselDots className="flex lg:hidden" />
        </Carousel>
      </div>
    </div>
  );
}
