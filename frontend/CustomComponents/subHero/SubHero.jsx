"use client";

import Image from "next/image";

const SubHero = () => {
  return (
    <div className="grid lg:grid-cols-4 grid-cols-2 items-center py-10 mt-5 gap-4 md:gap-10 justify-center  text-center  bg-[#F9FAFB]">
      <div className="flex flex-col items-center justify-center gap-1 ">
        <Image src="/images/bottle.png" width={32} height={36} />
        <p className="text-[16px] md:text-2xl font-semibold md:font-bold text-[#02331E] leading-none">
          Science backed
        </p>
        <p className="leading-3 text-sm font-normal text-center text-[#4B5563] lg:leading-normal">
          <span className=" md:flex hidden  leading-normal md:w-max">
            {" "}
            Recommendations based on peer reviewed
          </span>{" "}
          <span className="leading-3 lg:leading-normal -translate-y-4 md:-translate-y-0 ">
            {" "}
            skincare research{" "}
          </span>
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        <Image src="/images/doctor.png" width={32} height={36} />
        <p className="text-[16px] md:text-2xl font-semibold md:font-bold text-[#02331E] w-[260px] leading-none">
          Dermatologist verified
        </p>
        <p className="hidden md:flex text-sm font-normaltext-center text-[#4B5563] ">
          Every recommendation reviewed by <br /> board-certified dermatologists
        </p>
        <p className=" flex md:hidden text-sm font-normaltext-center text-[#4B5563]  md:-translate-y-0 ">
          Certified Doctors
        </p>
      </div>{" "}
      <div className="flex flex-col items-center justify-center gap-1 pt-2">
        <Image src="/images/star2.png" width={32} height={36} />
        <p className="text-[16px] md:text-2xl font-semibold md:font-bold text-[#02331E] leading-none">
          4.8/5
        </p>
        <p className="text-sm font-normaltext-center text-[#4B5563]  ">
          Rated by over 10,000 <br /> satisfied customer
        </p>
      </div>{" "}
      <div className="flex flex-col items-center justify-center gap-1">
        <Image src="/images/flower.png" width={32} height={36} />
        <p className="text-[16px] md:text-2xl font-semibold md:font-bold text-[#02331E] leading-none">
          Ai Powered
        </p>
        <p className="text-sm md:flex hidden font-normaltext-center text-[#4B5563] ">
          Analyzes thousands of ingredient
          <br /> combinations for your specific needs
        </p>
        <p className="text-sm md:hidden flex font-normaltext-center text-[#4B5563] -translate-y-2 md:-translate-y-0">
          Ingredient analysis
        </p>
      </div>
    </div>
  );
};
export default SubHero;
