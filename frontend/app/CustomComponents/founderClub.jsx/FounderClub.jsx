import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const images = [ '/images/hassan.png' , '/images/marwa.png' ,  '/images/rana.png' , '/images/nora.png', '/images/jack.png' ]
const names = ['Hassan' , 'Marwa' ,  'Rana' ,  'Nora' ,'Jack' ]
export default function FounderClub() {
  return (
    <div className="flex flex-col items-center pb-14 w-screen overflow-x-hidden bg-[#F3F4F6]  ">
      <div className="flex justify-center items-center mt-5 mb-4 ">
        {images.map((_, index) => (
          <div key={index}>
            {index % 2 === 0 ? (
              <div className="flex flex-col  items-center">
                <div className="w-auto h-auto md:w-[225px] md:h-auto relative translate-y-40 md:-translate-y-0   z-20 md:flex flex-col  py-2 px-1 md:gap-2 md:py-[20px] leading-tight md:px-2 bg-[#D9D9D9] rounded-[29px] ">
                  <p className="text-center text-[7px] font-semibold md:text-[18px] md:font-bold">
                    Start up 1
                  </p>
                  <p className="text-center md:text-[18px] text-[7px]">
                    Raised $14K in 3 months from 129394 investors
                  </p>
                </div>
                <div className="relative">
                <div className="absolute z-10 -translate-x-6 md:-translate-x-0   md:relative w-[100px] h-[200px] md:w-[250px] md:h-[400px]">

                  <Image
                    src={images[index]}
                    alt="image"
                    objectFit="contain" 
                    layout="fill"                   
                  />
                  </div>
                  <div className="relative   ">
                    <p className= "text-[10px] md:text-[18px] font-bold text-center">{names[index]}</p>
                    <p className= "text-[10px] md:text-[18px] text-center">Founder, XYZ</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center ">
                <div className="relative  ">
                  <div className="relative md:top-5 left-1 md:left-0  top-7">
                    <p className="text-[10px] md:text-[18px] font-bold text-center">{names[index]}</p>
                    <p className="text-[10px] md:text-[18px] text-center">Founder, XYZ</p>
                  </div>
                  <div className="absolute  -translate-x-6 md:-translate-x-0 md:relative w-[100px] h-[200px] md:w-[250px] md:h-[400px]">
                  <Image
                    src={images[index]}
                    alt="image"
                    objectFit="contain"
                    layout="fill"
                    />
                    
                    </div>
                </div>
                <div className="md:w-[225px] w-auto h-auto md:h-auto flex flex-col  py-2 px-2 md:gap-2 md:py-[20px] leading-tight md:px-1 bg-[#D9D9D9] rounded-[29px] relative md:-translate-y-0 translate-y-28  z-20 ">
                  <p className="text-center  text-[7px] md:text-[18px] font-bold">
                    Start up 1
                  </p>
                  <p className="text-center  text-[7px] md:text-[18px]">
                    Raised $14K in 3 months from 129393 investors
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Button
        className={cn(
          "flex justify-center text-[18px] font-medium py-[9px] bg-[#014367] text-white rounded-[10px] mb-8 hover:bg-[#014367] px-10 mt-44 md:mt-10     "
        )}
      >
        Join the Founders Club
      </Button>
    </div>
  );
}
