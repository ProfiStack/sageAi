import Image from "next/image";
export default function SteCard({ index , images ,titles ,description }) {
  return (
    <div className="w-[160px] md:w-auto relative flex flex-col  bg-community-gradient rounded-xl p-[2px]">
      <div className="px-2 py-1  md:p-2 md:px-5  rounded-full bg-[#143868] w-min absolute text-white font-bold text-[12px] md:text-[24px] -translate-y-4 -translate-x-3 md:-translate-y-6 md:-translate-x-5 flex justify-center items-center ">
        {index}
      </div>
      <div className="w-auto md:w-[258px]   bg-white px-2 md:px-4 rounded-xl flex flex-col gap-1 md:gap-3 py-1 md:py-6 shadow-lg">
        <p className="font-bold text-[12px] md:text-base">{titles}</p>
        <p className="leading-tight text-[12px] md:text-base ">
          {description}
        </p>
      </div>
      <div className="h-full flex justify-center items-center py-1 md:py-4">
        <div className="relative w-[160px] h-[160px] md:w-[216px] md:h-[232px]">
        <Image src={images} alt="image" objectFit="contain" layout="fill" />
        </div>
      </div>
    </div>
  );
}
