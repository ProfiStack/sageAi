import Image from "next/image";
export default function InvestorBanner() {
  return (
    <div className="  md:bg-banner-gradient bg-[#F3F4F6] ">
      <div className="w-full hidden md:flex ">
        <Image alt="image" width={1920} height={1080} src={'/images/investorBanner.png'} className="w-full h-full" />
      </div>
      <div className=" relative md:hidden opacity-40 w-screen h-[401px]  ">
        <Image alt="image" objectFit="cover" layout="fill" src={'/images/investorbannerBG2.png'} className="w-full h-full" />
      </div>
      <div className="flex flex-col items-center  absolute  top-[25%] md:top-[35%] md:left-1/2 transform md:-translate-x-1/2 md:-translate-y-[50%] md:pr-10">
        <div className="w-screen md:w-[350px] text-center">
          <p className="font-bold text-[40px] mx-2 text-[#014367] leading-tight">
            Raise Capital,<br/> Build Momentum, Grow Your Vision
          </p>
          <p className="text-[16px] font-normal mx-12  text-black md:text-[#545B79] mt-4">
            Connect with investors, gain exposure, and turn your startup dreams
            into reality.
          </p>
          <p className="text-[16px] font-normal text-black md:text-[#545B79] mb-4">
            Let's bulid the future together!{" "}
          </p>
          <button className="py-2 px-6 rounded-[8px] bg-[#014367]  text-white">
            Start Raising Capital Today
          </button>
        </div>
      </div>
    </div>
  );
}
