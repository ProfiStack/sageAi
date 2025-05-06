"use client";
import { ArrowLeft, Sprout } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductDeatils() {
  const router = useRouter();
  return (
    <div className="py-3 px-5">
      <ArrowLeft
        className="absolute mt-1"
        onClick={() => {
          router.back();
        }}
      />
      <div className="flex items-center justify-center  text-white font-semibold">
        <p className="px-4 flex gap-2 items-center  py-1 bg-[#02331E80] rounded-2xl">
          <Sprout color="#02331E" fill="#02331E" />
          Natural
        </p>
        <p className="px-4 py-1 bg-[#02331E] rounded-2xl">Non Natural</p>
      </div>
      <p className="text-2xl font-medium  py-3">Pigmentation</p>
      <p className="text-[19px] font-light">
        Vitamin C Suspension 23% + HA Spheres 2%
      </p>
      <div className="w-full flex justify-center py-4">
        <Image src="/images/vitamin.png" height={150} width={150} />
      </div>
      <p>
        Vitamin C Suspension 23% in HA Spheres uses direct vitamin C and
        hyaluronic acid to help visibly reduce signs of aging by brightening and
        balancing uneven skin tone. This water-free formula provides 23% pure
        L-Ascorbic Acid which remains completely stable due to the absence of
        water. What’s more, this water-free formula is supported with spheres of
        hyaluronic acid for added hydration.
      </p>
      <p>
        Note: The slightly granular texture of this product is due to the
        vitamin C powder being suspended in an oil-like base and therefore each
        application requires a few seconds to feel absorbed by the skin. If
        desired, this formula can be diluted in a cream base per application to
        allow the skin to build tolerance over time.
      </p>
      <div className="flex justify-between my-6">
        <div className="space-y-1">
          <p className="text-sm font-semibold ">when to use</p>
          <p className="text-sm font-light"> Use in PM</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold ">Good for</p>
          <p className="text-sm font-light">6 months after opening.</p>
        </div>
      </div>
      <div className="flex justify-center">
        <p className="px-[80px] rounded-2xl py-4 bg-[#D4B038] text-white font-semibold">
          Do Not Use It With
        </p>
      </div>
      <div className="grid grid-cols-2 place-items-center gap-y-3 gap-x-6 my-4">
        {Array.from({ length: 6 }).map((_, index) => {
          return (
            <div
              key={index}
              className="w-[155px] h-[61px] text-center flex justify-center items-center rounded-full bg-[#ACACAC] text-white"
            >
              direct acid
            </div>
          );
        })}
      </div>
      <div className="flex justify-center my-4">
        <button className="px-[53px] py-4 bg-[#02331E] rounded-2xl text-white font-semibold ">
          Best place to purcahse
        </button>
      </div>
    </div>
  );
}
