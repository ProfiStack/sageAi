import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function PopularUsers() {
  return (
    <div className="mb-2">
      <p className="text-2xl font-semibold text-[#545454] mb-3 ps-2">
        Popular Users
      </p>
      <div className="overflow-x-hidden">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full ms-2 "
        >
          <CarouselContent>
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-1/6 md:basis-auto me-6"
              >
                <div className="space-y-1">
                  <div className="relative w-[84px] h-[84px] rounded-full">
                    <Image
                      src="/images/popularUsers.png"
                      objectFit="cover"
                      layout="fill"
                    />
                  </div>
                  <p className="font-medium text-[#939393]">@Cameron</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
