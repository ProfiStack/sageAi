"use client";
import Image from "next/image";
export default function Footer() {
  return (
    <div>
      <div className=" flex justify-between my-5 container mx-auto">
        <div className="flex flex-col">
          <p className="text-[16px] md:text-[20px] font-bold text-[#02331E]">
            Sagee Ai
          </p>
          <p className="text-[#4B5563] text-[12px] md:text-[16px]">
            Your AI-powered <br className="flex md:hidden" /> skincare companion
          </p>
        </div>
        <div className="flex flex-col gap-2 items-start justify-start">
          <p className="font-bold md:text-[16px] text-[12px]">Quick Links</p>
          <div className="flex flex-col justify-start items-start text-[#4B5563] gap-1  md:text-[16px] text-[12px]">
            <button> About Us</button>
            <button>How It Works</button>
            <button>Quizzes</button>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-start justify-start ">
          <p className="font-bold  md:text-[16px] text-[12px]">Legal</p>
          <div className="flex flex-col justify-start items-start text-[#4B5563] gap-1  md:text-[16px] text-[12px]">
            <button>Privacy Policy</button>
            <button>Terms of Service</button>
            <button>Contact</button>
          </div>
        </div>
        <div className=" gap-2 items-start md:flex hidden">
          <Image src="/images/insta.svg" width={18} height={20} />
          <Image src="/images/facebook.svg" width={18} height={20} />
          <Image src="/images/twitter.svg" width={18} height={20} />
          <Image src="/images/tiktok.svg" width={18} height={20} />
        </div>
      </div>
      <div className=" gap-2 items-start flex md:hidden justify-center">
        <Image src="/images/insta.svg" width={18} height={20} />
        <Image src="/images/facebook.svg" width={18} height={20} />
        <Image src="/images/twitter.svg" width={18} height={20} />
        <Image src="/images/tiktok.svg" width={18} height={20} />
      </div>
      <hr className="container mx-auto  my-3 text-[#E5E7EB] flex w-full" />
      <p className="my-10 text-[#4B5563] flex justify-center">
        © 2025 SageeAi. All rights reserved.
      </p>
    </div>
  );
}
