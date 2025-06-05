"use client";
import QuizzHeader from "@/CustomComponents/quizzHeader/QuizzHeader";
import { useQuizzStore } from "@/store/quizzStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SkinType() {
  const router = useRouter();
  const { setAnswers, answers, quizzData } = useQuizzStore();

  const selectedOption = answers.skinType || "";
  const handleChange = (option) => {
    setAnswers("skinType", option.title);
  };
  const data = quizzData?.[2];

  const handleNext = () => {
    router.push("/quizz/describeLifestyle");
  };
  return (
    <div>
      <QuizzHeader barWidth={50} pageNumber={3} />
      <div className="bg-[#FAFAFA] px-4 pb-4">
        <div>
          <p className="text-2xl text-[#02331E] font-bold leading-tight pb-2">
            {data?.title}
          </p>
          <p className="text-[#525252]">{data?.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 bg-white p-4 mt-5 rounded-xl">
          {data?.quiz?.map((subData, index) => {
            return (
              <button
                key={index}
                onClick={() => handleChange(subData)}
                className={`px-[41px] py-5 rounded-xl border border-[#E5E5E5] flex items-center justify-center flex-col gap-2 ${selectedOption === subData.title ? "bg-[#E5F8F8]" : "bg-white"}`}
              >
                <div className="p-1 bg-[#E5E7EB] rounded-full w-min h-min">
                  <div className="relative w-14 h-14">
                    <Image
                      src={subData?.icon}
                      objectFit="contain"
                      layout="fill"
                    />
                  </div>
                </div>
                <p className="text-sm text-[#02331E]">{subData?.title}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-t-[#E5E5E5] sticky inset-0 bg-white ">
        <button
          onClick={handleNext}
          disabled={!selectedOption}
          className="disabled:bg-gray-300 bg-[#02331E] w-full py-[18px] text-white rounded-xl font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
