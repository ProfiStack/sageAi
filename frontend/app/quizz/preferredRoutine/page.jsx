"use client";
import QuizzHeader from "@/CustomComponents/quizzHeader/QuizzHeader";
import { useQuizzStore } from "@/store/quizzStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SpecificConcerns() {
  const { setAnswers, answers, quizzData } = useQuizzStore();

  const selectedOptions = answers.preferredRoutine || [];
  const router = useRouter();

  const data = quizzData?.[5];

  const handleChange = (option) => {
    const updatedOptions = selectedOptions.includes(option.title)
      ? selectedOptions.filter((item) => item !== option.title)
      : [...selectedOptions, option.title];
    setAnswers("preferredRoutine", updatedOptions);
  };
  const handleNext = () => {
    router.push("/result");
  };
  return (
    <div>
      <QuizzHeader barWidth={100} pageNumber={6} />

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
                className={`${selectedOptions?.includes(subData?.title) ? "bg-[#E5F8F8]" : "bg-white"} w-full py-4 px-4 flex gap-4 items-center rounded-[12px] border border-[#E5E5E5]`}
                key={index}
              >
                <div className=" p-1 rounded-full bg-[#E5E7EB]">
                  <div className="relative w-12 h-12 ">
                    <Image
                      src={subData?.icon}
                      objectFit="contain"
                      layout="fill"
                      alt="preferred routine"
                      className=""
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-[#02331E] flex justify-start">
                    {subData?.title}
                  </p>
                  <p className="text-[#525252] text-sm flex justify-start">
                    {subData?.description}
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
          Analyze
        </button>
      </div>
    </div>
  );
}
