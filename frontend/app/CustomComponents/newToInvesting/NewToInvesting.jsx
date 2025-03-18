import Image from "next/image";

export default function NewToInvesting() {
  return (
    <div className="pb-10 md:pb-20 mx-4 ">
      <div className="flex flex-col items-center  ">
        <div className=" md:w-[1040px] pb-5 flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2">
            <p className="text-[28px] md:text-[48px] font-bold text-[#014367]">
              New{" "}
            </p>
            <p className="text-[28px] md:text-[48px] font-normal text-[#014367]">
              to Investing?
            </p>
          </div>
          <p className="text-[15px] text-center md:text-start md:text-[18px] text-[#4D4D4D]">
            Turn your blessings into opportunities—support visionary founders,
            expand your investments,
            <br className="hidden md:flex" /> and be part of a dynamic community
          </p>
        </div>
        <div className="flex flex-col md:flex-row px-4 md:px-8 rounded-[20px] py-4 bg-lightGreenGray">
          <div className="">
            <Image
              src={"/images/Research.png"}
              width={80}
              height={62}
              className="pb-10 "
            />
            <p className="text-[24px] font-semibold text-[#014367] md:leading-loose   ">
              Research before Investing ?
            </p>
            <p className="text-[15px] pb-4">
              Startups can offer high rewards but come
              <br /> with significant risk. Invest only what you can <br />{" "}
              afford to lose and be ready for the possibility <br /> of
              early-stage ventures failing.
            </p>
          </div>
          <hr className="flex relative top-4 border-t-[1px] md:border-r-[1px] md:border-t-0 items-center py-4 md:mx-4   md:h-[220px]  border-gray-300    " />

          <div className="">
            <Image
              src={"/images/HighRisk.png"}
              width={80}
              height={62}
              className="pb-10 "
            />
            <p className="text-[24px] font-semibold text-[#014367] leading-10">
              Be prepared for high risk
            </p>
            <p className="text-[15px] pb-4">
              Startups can offer high rewards but come <br /> with significant
              risk. Invest only what you can <br /> afford to lose and be ready
              for the possibility <br /> of early-stage ventures failing.
            </p>
          </div>
          <hr className="flex relative top-4 border-t-[1px] md:border-r-[1px] md:border-t-0 items-center py-4 md:mx-4   md:h-[220px]  border-gray-300    " />

          <div className="">
            <Image
              src={"/images/Diversification.png"}
              width={80}
              height={62}
              className="pb-10 "
            />
            <p className="text-[24px] font-semibold text-[#014367] leading-3 pb-[14px]">
              Look for diversification
            </p>
            <p className="text-[15px] pb-4">
              Startups can offer high rewards but come <br /> with significant
              risk. Invest only what you can <br /> afford to lose and be ready
              for the possibility <br /> of early-stage ventures failing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
