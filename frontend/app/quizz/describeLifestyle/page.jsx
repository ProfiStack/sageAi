"use client";
import QuizzHeader from "@/CustomComponents/quizzHeader/QuizzHeader";
import { useQuizzStore } from "@/store/quizzStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SpecificConcerns() {
  const { setAnswers, answers, quizzData } = useQuizzStore();

  const router = useRouter();
  const selectedOptions = answers.describeLifestyle || [];
  const data = quizzData?.[3];
  const handleChange = (option) => {
    const updatedOptions = selectedOptions.includes(option.title)
      ? selectedOptions.filter((item) => item !== option.title)
      : [...selectedOptions, option.title];
    setAnswers("describeLifestyle", updatedOptions);
  };
  const handleNext = () => {
    router.push("/quizz/specificConcerns");
  };
  return (
    <div>
      <QuizzHeader barWidth={65} pageNumber={4} />

      <div className="bg-[#FAFAFA] px-4">
        <div>
          <p className="text-2xl text-[#02331E] font-bold">{data?.title}</p>
          <p className="text-[#525252]">{data?.description}</p>
        </div>
        <div className="space-y-4 pt-3 mb-4">
          {data?.quiz?.map((subData, index) => {
            return (
              <button
                onClick={() => handleChange(subData)}
                className={`${selectedOptions?.includes(subData.title) ? "bg-[#E5F8F8]" : "bg-white"} w-full py-3 px-4 flex gap-4 items-center rounded-[12px] border border-[#E5E5E5]`}
                key={index}
              >
                <div className="relative w-[15px] h-[20px] ">
                  <Image
                    src={subData?.icon}
                    objectFit="contain"
                    layout="fill"
                  />
                </div>
                <div>
                  <p className=" text-[#02331E] flex justify-start">
                    {subData?.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="p-4 border-t border-t-[#E5E5E5] sticky inset-0 bg-white ">
        <button
          onClick={handleNext}
          disabled={selectedOptions?.length === 0}
          className="disabled:bg-gray-300 bg-[#02331E] w-full py-[18px] text-white rounded-xl font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
