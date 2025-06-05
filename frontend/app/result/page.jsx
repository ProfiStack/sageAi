"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuizzStore } from "@/store/quizzStore";
import Image from "next/image";

export default function Result() {
  const { answers } = useQuizzStore();
  const selfieUrl = answers?.selfie?.previewUrl;

  return (
    <div>
      <div className=" flex items-center justify-center pt-1">
        <div className="relative h-[68px] w-[68px]">
          <Image src="/images/sagelogo2.png" objectFit="fill" layout="fill" />
        </div>
      </div>
      <hr className="w-full text-[#E5E5E5]" />
      <div className="flex justify-center flex-col items-center bg-[#F9FAFB] pt-4">
        <p className="text-[26px] font-bold text-center leading-none">
          Your Personalized <br /> Skincare DNA
        </p>
        <div className="relative w-[166px] h-[166px] rounded-full">
          <Image
            src={selfieUrl}
            objectFit="fill"
            layout="fill"
            className="rounded-full"
          />
        </div>
        <p className="flex justify-center text-[20px] font-bold text-[#02331E]">
          {" "}
          Skin Type Placeholder
        </p>
        <div className="flex items-center justify-center gap-2 mt-2 mb-4">
          {Array.from({ length: 2 }).map((_, index) => {
            return (
              <p className="py-[10px] px-4 text-white text-sm rounded-3xl bg-[#02331E]">
                92% Match
              </p>
            );
          })}
        </div>
      </div>
      <div className="px-4 bg-[#F9FAFB] pb-6">
        <p className="text-[20px] font-bold text-[#02331E] pb-2">
          Your Perfect Products
        </p>
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, index) => {
            return (
              <div className="p-4 rounded-xl shadow-[0_14px_16px_rgba(0,0,0,0.1)] bg-white w-full">
                <div className="relative w-full h-[128px]">
                  <Image
                    src="/images/result.png"
                    objectFit="fill"
                    layout="fill"
                  />
                </div>
                <p className="px-2 py-1 text-xs bg-[#02331E] text-white rounded-3xl mb-1 mt-3 w-max">
                  ♻️ Eco-Friendly
                </p>
                <p className="w-max text-sm text-[#000000] mb-2 leading-none">
                  Hydrating Serum
                </p>
                <button
                  type="button"
                  className=" text-sm rounded-xl text-white py-[10px] bg-[#02331E] w-full "
                >
                  Buy Now
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="px-4 py-6">
        <p className="text-[20px] font-bold text-[#02331E] leading-none ">
          Your Daily Routine
        </p>

        <Tabs defaultValue="morning" className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-2 my-4">
            <TabsTrigger
              value="morning"
              className="data-[state=active]:bg-[#02331E] data-[state=active]:text-white py-[10px] rounded-[10px] bg-[#F3F4F6]"
            >
              Morning
            </TabsTrigger>
            <TabsTrigger
              value="evening"
              className="data-[state=active]:bg-[#02331E] data-[state=active]:text-white py-[10px] rounded-[10px] bg-[#F3F4F6]"
            >
              Evening
            </TabsTrigger>
          </TabsList>
          <TabsContent value="morning">
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => {
                return (
                  <div className="flex items-center gap-2 p-4 bg-[#F9FAFB] rounded-[10px]">
                    <p className=" flex items-center justify-center w-8 h-8 bg-[#D4B038]  rounded-full text-white ">
                      {index + 1}
                    </p>
                    <p>Serum</p>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value="evening">
            <div className="space-y-4">
              {" "}
              {Array.from({ length: 2 }).map((_, index) => {
                return (
                  <div className="flex items-center gap-2 p-4 bg-[#F9FAFB] rounded-[10px]">
                    <p className="w-8 h-8 flex items-center justify-center  bg-[#D4B038]  rounded-full text-white">
                      {index + 1}
                    </p>
                    <p>cleanser</p>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="py-6 px-4 bg-[#F9FAFB]">
        <p className="text-[20px] font-bold pb-4">Your Impact</p>
        <div className="p-6 rounded-xl shadow-[0_14px_16px_rgba(0,0,0,0.1)] bg-white space-y-4">
          {Array.from({ length: 2 }).map((_, index) => {
            return (
              <div className=" rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#4B5563]">Plastic Saved</p>
                  <p className="text-[24px] font-bold text-[#02331E]">
                    12 bottles
                  </p>
                </div>
                <Image src="/images/recycle.png" height={36} width={36} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="py-7 px-4 bg-white space-y-3">
        <button
          type="button"
          className=" py-[14px] rounded-2xl bg-[#02331E] font-bold flex justify-center items-center w-full text-white"
        >
          Share My Routine{" "}
        </button>
        <button
          type="button"
          className=" py-[14px] rounded-2xl bg-[#02331E] font-bold flex justify-center items-center w-full text-white"
        >
          Continue To Recommendations{" "}
        </button>
      </div>
    </div>
  );
}
