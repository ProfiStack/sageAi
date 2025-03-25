"use client";

import Image from "next/image";

const SubHero = () => {
  return (
    <div className="grid lg:grid-cols-4 grid-cols-2   items-center py-10 mt-5 gap-10 justify-center  text-center  bg-[#F9FAFB]">
      <div className="flex flex-col items-center justify-center gap-2">
        <Image src="/images/bottle.png" width={32} height={36} />
        <p className="text-2xl font-bold text-[#02331E]">Science backed</p>
        <p className="text-sm font-normaltext-center text-[#4B5563] ">
          Recommendations based on peer reviewed{" "}
          <br className="lg:hidden xl:flex" /> skincare research
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <Image src="/images/doctor.png" width={32} height={36} />
        <p className="text-2xl font-bold text-[#02331E] w-[260px]">
          Dermatologist verified
        </p>
        <p className="text-sm font-normaltext-center text-[#4B5563] ">
          Every recommendation reviewed by <br /> board-certified dermatologists
        </p>
      </div>{" "}
      <div className="flex flex-col items-center justify-center gap-2">
        <Image src="/images/star2.png" width={32} height={36} />
        <p className="text-2xl font-bold text-[#02331E]">4.8/5</p>
        <p className="text-sm font-normaltext-center text-[#4B5563]  ">
          Rated by over 10,000 <br /> satisfied customer
        </p>
      </div>{" "}
      <div className="flex flex-col items-center justify-center gap-2">
        <Image src="/images/flower.png" width={32} height={36} />
        <p className="text-2xl font-bold text-[#02331E]">Ai Powered</p>
        <p className="text-sm font-normaltext-center text-[#4B5563] ">
          Analyzes thousands of ingredient
          <br /> combinations for your specific needs
        </p>
      </div>
    </div>
  );
};
export default SubHero;
