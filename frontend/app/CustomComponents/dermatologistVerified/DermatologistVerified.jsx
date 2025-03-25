import Image from "next/image";
import DermatologistCard from "../dermatologistCard/DermatologistCard";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
export default function DermatologistVerified() {
  return (
    <div className="my-10 container mx-auto">
      <p className="text-[36px] font-bold flex justify-center">
        Dermatologist Verified
      </p>
      <div className="hidden lg:flex items-center justify-center gap-10">
        {Array.from({ length: 2 }).map((_, index) => (
          <>
            <DermatologistCard />
            {index === 0 && (
              <div className="relative w-[86px] h-[86px] ">
                <Image
                  src="/images/verified.png"
                  objectFit="cover"
                  layout="fill"
                />
              </div>
            )}
          </>
        ))}
      </div>
      <div className="lg:hidden flex justify-center items-center">
        <Carousel>
          <CarouselContent>
            {Array.from({ length: 2 }).map((_, index) => (
              <CarouselItem className="flex flex-col items-center mb-2">
                <DermatologistCard />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselDots className="flex lg:hidden  " />
        </Carousel>
      </div>
    </div>
  );
}
