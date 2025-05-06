import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function GuessWork() {
  return (
    <div className="  bg-[#02331ED9] py-4">
      <div className="  flex lg:justify-end justify-center items-center md:gap-12 lg:gap-12  2xl:gap-56 ">
        <div className="flex flex-col items-center space-y-5 md:space-y-10">
          <p className="text-[24px] md:text-[36px] font-bold text-white text-center">
            Ditch the guesswork, your <br className="flex md:hidden" /> glow{" "}
            <br className="xl:flex hidden" /> starts here!✨
          </p>
          <div className="flex items-center bg-white w-max px-5 md:px-10 rounded-full gap-5">
            <button className="flex items-center py-2 md:py-3 text-[#02331E] text-[16px] md:text-[24px] font-semibold">
              Analyse my skin now{" "}
            </button>
            <div className="bg-[#02331E] rounded-full md:p-1">
              <ArrowUpRight color="white" />
            </div>
          </div>
        </div>
        <div className="relative w-[681px] h-[227px] hidden lg:flex">
          <Image src="/images/effect.png" objectFit="cover" layout="fill" />
        </div>
      </div>
    </div>
  );
}
