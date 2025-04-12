import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function QuizzHeader({ barWidth, pageNumber }) {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <div className=" ">
      <div className="space-y-4 px-2 pt-4 ">
        <div className="flex justify-between px-1 items-center">
          <button onClick={handleBack}>
            <ArrowLeft width={16} height={16} color="#404040" />
          </button>
          <p className="text-sm text-[#525252]">Question {pageNumber} of 6</p>
        </div>
        <div className="relative w-[100%] rounded-full bg-[#E5E5E5] ">
          <div
            className="  py-1 rounded-full bg-[#02331E] transition-all duration-1000"
            style={{ width: `${barWidth.toFixed(0)}%` }}
          ></div>
        </div>
        <hr className="text-[#E5E5E5] " />
      </div>

      <div className="flex justify-center bg-[#FAFAFA]">
        <div className="relative w-[184px] h-[206px]">
          <Image
            src="/images/quizzLogo.png"
            objectFit="contain"
            layout="fill"
          />
        </div>
      </div>
    </div>
  );
}
