import Image from "next/image";
export default function Struggle() {
  return (
    <div className=" pb-2 md:pb-16 overflow-hidden bg-[#F3F4F6]">
      <div className="flex flex-col items-center gap-4 md:gap-8 mb-10">
        <p className=" md:w-[542px] md:text-[40px] font-bold text-center text-[#014367] leading-tight">
          We know what it takes, We’ve been there ourselves
        </p>
        <p className=" md:w-[569px] md:text-[18px] text-[#545B79] text-center">
          At Ni3mat, we’re not just a platform, we’re founders too. We’ve built
          our support around the resources we wished we had when starting out.
          From expert guidance to strategic connections, we’re here to help you
          thrive.
        </p>
      </div>
      <div className="flex justify-center flex-wrap gap-x-14 gap-y-4  md:gap-32  md:translate-x-10   md:mt-14 mb-8 md:mb-0  ">
        <div className="md:-translate-y-40 flex flex-col items-center ">
          <div className="relative md:w-[100px] md:h-[100px] w-[50px] h-[50px]">
          <Image objectFit="contain" layout="fill" src={'/images/Strategic.png'} />
    </div>
          <p className="w-min md:text-[28px] font-medium text-[#014367] leading-tight text-center">
            Strategic Guidance
          </p>
        </div>
        <div className="md:-translate-y-20 flex flex-col items-center ">
          <div className="relative md:w-[100px] md:h-[100px] w-[50px] h-[50px]">
          <Image objectFit="contain" layout="fill" src={'/images/ExpertNetworks.png'} />
          </div>

          <p className="w-min md:text-[28px] font-medium text-[#014367] leading-tight text-center">
            Access to Expert Networks
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative md:w-[100px] md:h-[100px] w-[50px] h-[50px]">
          <Image objectFit="contain" layout="fill" src={'/images/LegalSupport.png'} />
 </div>
          <p className="w-min md:text-[28px] font-medium text-[#014367] leading-tight text-center">
            Legal & Compliance Support
          </p>
        </div>
        <div className="md:-translate-y-20 flex flex-col items-center ">
          <div className="relative md:w-[100px] md:h-[100px] w-[50px] h-[50px]">
          <Image objectFit="contain" layout="fill" src={'/images/FundRaising.png'} />
  </div>
          <p className="w-min md:text-[28px] font-medium text-[#014367] leading-tight text-center">
            Fundraising Tips & Best Practices
          </p>
        </div>
        <div className="md:-translate-y-40 flex flex-col items-center  ">
          <div className="relative md:w-[100px] md:h-[100px] w-[50px] h-[50px]">
          <Image objectFit="contain" layout="fill" src={'/images/Community.png'} />
    </div>
          <p className="w-min md:text-[28px] font-medium text-[#014367] leading-tight text-center">
            Community of Founders
          </p>
        </div>
      </div>
      <div className="flex justify-center md:mt-10">
        <p className="text-center md:w-[854px] font-semibold ">
          From combining your investors into a single cap table to handling your
          SAFE notes, legalities and investor communications - all so you can
          focus on growing your community
        </p>
      </div>
      <div className="flex justify-center mt-10">
        <div className="md:w-[637px] mx-2 bg-community-gradient pb-[10px] px-[1px] pt-[1px] rounded-xl ">
          <div className="w-full bg-white text-center md:py-6 px-2 rounded-xl">
            <p className=" md:mb-4 font-bold">What’s in it for us?</p>
            <p className="md:text-[14px] font-medium">
              Our fee structure is simple: pay a flat X% on the funds you raise,
              plus an annual X% fee, capped at $X per year. No costs
              upfront—only pay once you've successfully raised
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
