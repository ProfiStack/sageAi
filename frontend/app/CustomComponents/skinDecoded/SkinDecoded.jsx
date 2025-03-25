"use client";

import Image from "next/image";

export default function SkinDecoded() {
  return (
    <div className="mt-10 container mx-auto">
      <div className="flex items-center justify-center">
        <p className="text-[36px] font-bold">Your skin, decoded in 3 steps</p>
      </div>
      <div className="flex justify-between items-center text-center ">
        <div className="flex flex-col items-center gap-2">
          <p>Skin concern?</p>
          <div className="flex gap-2">
            <div>
              <div className="relative w-[100px] h-[119px]">
                <Image
                  src="/images/blackHeads.png"
                  objectFit="contain"
                  layout="fill"
                />
              </div>
              <p className="font-medium">Black Heads</p>
            </div>
            <div>
              <div className="relative w-[100px] h-[119px] ">
                <Image
                  src="/images/acne.png"
                  objectFit="contain"
                  layout="fill"
                />
              </div>
              <p className="font-medium">Acne</p>
            </div>
          </div>
          <p className="text-[20px] font-bold leading-none">Answer questions</p>
          <p className="text-[16px] font-normal text-[#4B5563]">
            Tell us about your skin concerns,
            <br /> goals, and history in our 60 second <br /> quiz
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 mt-10">
          <div className="relative w-[100px] h-[119px]">
            <Image src="/images/selfie.png" layout="fill" objectFit="cover" />
          </div>
          <p className="text-[20px] font-bold ">Optional selfie</p>
          <p className="text-[16px] font-normal text-[#4B5563]">
            Upload a photo for enhanced <br /> analysis (not required, but
            <br /> improves accuracy)
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 mt-7">
          <div className="relative w-[100px] h-[119px]">
            <Image src="/images/report.png" layout="fill" objectFit="cover" />
          </div>
          <p className="text-[20px] font-bold ">Get your personalised report</p>
          <p className="text-[16px] font-normal text-[#4B5563]">
            Personalized insights and science <br /> backed product
            recommendations
          </p>
        </div>
      </div>
      <p className="flex justify-center mt-5 font-mono   text-[#4B5563]">
        No sign-up needed. No gimmicks. Just your skin, decoded.
      </p>
    </div>
  );
}
