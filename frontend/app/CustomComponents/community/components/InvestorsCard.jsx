import Image from "next/image";
export default function () {
  return (
    <div>
      <div className="w-full md:w-[1058px] h-auto bg-community-gradient md:px-[1px] pt-[1px] pb-4 rounded-[7px]   ">
        <div className="w-full h-auto bg-white rounded-[8px] ">
          <div className="flex justify-between mx-4 gap-10  md:mx-20 py-5 md:py-10">
            <div>
              <div className="relative w-[100px] h-[70px] md:w-[290px] md:h-[233px]">
              <Image objectFit="contain" layout="fill" src={'/images/yuka.webp.png'} alt="image" />
              </div>
              <p className="text-center text-[10px] md:text-[18px] font-bold">Marwa</p>
              <p className="text-[10px] md:text-[18px] text-center">Founder XYZ</p>
            </div>
            <div className="w-[179px] md:w-[379px] flex flex-col gap-2 md:gap-10 justify-center ">
              <p className=" text-[10px] md:text-[16px] font-bold">
                Look for diversification opportunities
              </p>
              <p className=" text-[9px] md:text-[16px] font-normal ">
                Invest in a range of startups across different industries or
                stages. This can help balance the risk and increase your chances
                of backing a successful venture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
