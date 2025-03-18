"use client";
import Image from "next/image";
export default function Footer() {
  return (
    <div className="overflow-hidden mx-4 md:container md:mx-auto">
      <div className="flex gap-14 md:gap-0 md:justify-between">
        <div>
          <div className="relative w-[50px] h-[50px] md:w-[100px] md:h-[100px]">
            <Image
              src={"/images/logo.png"}
              alt="logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <p className="text-[16px] font-[400px] w-auto text-[#545B79]">
            Please contact us if you have any specific idea or request.
          </p>
          <button
            className="text-[15px] font-[400px] text-[#356DF6]"
            onClick={() => window.open("mailto:info@naimaat.com")}
          >
            info@niamaat.com
          </button>
        </div>
        <div>
          <div className="flex flex-col items-start gap-2">
            <p className="text-[14px] font-[400px] text-[#545B79]">Socials</p>
            <button className="text-[16px] font-[300px]">Twitter</button>
            <button className="text-[16px] font-[300px]">Instagram</button>
            <button className="text-[16px] font-[300px]"> Twitter</button>
          </div>
        </div>
      </div>
      <hr className="border-t-[1px] border-[#D1D5DB] w-full mt-10 mb-5" />
      <div className="flex justify-between mb-5">
        <div>
          <p className="text-[#545B79] text-[14px] font-[400px]">
            © 2024 NAIMAAT. All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
