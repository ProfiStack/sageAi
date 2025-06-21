import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const handleOnClick = (route) => {
    router.push(route);
  };
  return (
    <div className="rounded-t-[38px] -translate-y-8  bg-white">
      <div className="grid grid-cols-2 items-center  ">
        <div className="ps-2 flex justify-center flex-col ">
          <div className="flex items-center w-full justify-stretch ">
            {" "}
            <p className="text-[20px] text-[#4F4644] font-semibold">
              Skin Analysis
            </p>{" "}
            <Image src="/images/camIcon.png" width={33} height={36} />
          </div>
          <p className="font-medium text-[#757474]">
            Results that help you <br /> get your perfect skin
          </p>
          <button className="py-2 px-5 text-lg font-medium text-white mt-4 w-max rounded-3xl bg-[#02331E]">
            {" "}
            View Report
          </button>
        </div>
        <div className="w-full flex justify-end">
          <div className="relative w-[209px] h-[226px] rounded-t-[38px] ">
            <Image
              src="/images/faceAnalyze.png"
              objectFit="fill"
              layout="fill"
              className="rounded-tr-[38px]"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2  px-2 mt-6">
        <div className="px-2 py-8 bg-[#FFC10759] rounded-2xl ">
          <button className="space-y-3 flex flex-col items-center text-start text-[20px] font-medium text-[#948E91] ">
            <Image src="/images/dermatologist.png" width={65} height={65} />
            <p> Dermatologist treatment recommendation</p>
          </button>
        </div>
        <div className="px-2 py-8  bg-[#02331E1A] rounded-2xl">
          <button
            onClick={() => handleOnClick("/quizz/")}
            className="space-y-4  flex flex-col items-center text-start text-[20px] font-medium  text-[#948E91] "
          >
            <Image src="/images/skincare.png" width={65} height={65} />
            <p>
              Skincare routine <br /> builder
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
