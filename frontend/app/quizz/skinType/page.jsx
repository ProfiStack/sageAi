"use client";
import QuizzHeader from "@/CustomComponents/quizzHeader/QuizzHeader";
import { useQuizzStore } from "@/store/quizzStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SkinType() {
  const router = useRouter();
  const { setAnswers } = useQuizzStore();
  const { answers } = useQuizzStore();
  const [selectedOption, setSelectedOption] = useState(() => {
    return answers.skinType ? answers.skinType : "";
  });
  const handleChange = (option) => {
    setSelectedOption(option);
  };
  const options = ["Oily", "Dry", "Combination", "Sensitive"];
  const handleNext = () => {
    setAnswers("skinType", selectedOption);
    router.push("/quizz/describeLifestyle");
  };
  return (
    <div>
      <QuizzHeader barWidth={50} pageNumber={3} />
      <div className="bg-[#FAFAFA] px-4 pb-4">
        <div>
          <p className="text-2xl text-[#02331E] font-bold leading-tight pb-2">
            What’s your skin type?
          </p>
          <p className="text-[#525252]">
            Understanding your skin type is essential for personalized skincare.
            Choose the option that best describes your day-to-day skin
            behaviour.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 bg-white p-4 mt-5 rounded-xl">
          {options.map((option, index) => {
            return (
              <button
                key={index}
                onClick={() => handleChange(option)}
                className={`px-[41px] py-5 rounded-xl border border-[#E5E5E5] flex items-center justify-center flex-col gap-2 ${selectedOption === option ? "bg-[#E5F8F8]" : "bg-white"}`}
              >
                <div className="p-5 bg-[#E5E7EB] rounded-full w-min h-min">
                  <div className="relative w-4 h-4">
                    <Image
                      src="/images/primaryGoals.png"
                      objectFit="contain"
                      layout="fill"
                    />
                  </div>
                </div>
                <p className="text-sm text-[#02331E]">{option}</p>
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
