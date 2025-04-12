"use client";
import QuizzHeader from "@/CustomComponents/quizzHeader/QuizzHeader";
import { useQuizzStore } from "@/store/quizzStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PrimaryGoals() {
  const { setAnswers } = useQuizzStore();
  const { answers } = useQuizzStore();

  const [selectedOptions, setSelectedOptions] = useState(() => {
    return answers.primaryGoals ? answers.primaryGoals : [];
  });
  const router = useRouter();

  const options = ["Hydration", "Radiance", "Anti-aging", "Salman"];

  const handleChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleNext = () => {
    setAnswers("primaryGoals", selectedOptions);
    router.push("/quizz/uploadSelfie");
  };
  return (
    <div>
      <QuizzHeader barWidth={15} pageNumber={1} />

      <div className="bg-[#FAFAFA] px-4">
        <div>
          <p className="text-2xl text-[#02331E] font-bold">
            What are your primary beauty goals?
          </p>
          <p className="text-[#525252]">
            Select one or more goals that best describe what you want to achieve
            for your skin. This helps us tailor recommendations that align with
            your preferences.
          </p>
        </div>
        <div className="space-y-4 pt-3 mb-4">
          {options.map((option, index) => {
            return (
              <button
                onClick={() => handleChange(option)}
                className={`${selectedOptions.includes(option) ? "bg-[#E5F8F8]" : "bg-white"} w-full py-4 px-4 flex gap-4 items-center rounded-[12px] border border-[#E5E5E5]`}
                key={index}
              >
                <div className="py-[14px] px-4 rounded-full bg-[#E5E7EB]">
                  <div className="relative w-[16px] h-[20px] ">
                    <Image
                      src="/images/primaryGoals.png"
                      objectFit="contain"
                      layout="fill"
                      className=""
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-[#02331E] flex justify-start">
                    {option}
                  </p>
                  <p className="text-[#525252] text-sm">
                    Boost moisture retention
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
          disabled={selectedOptions.length === 0}
          className="disabled:bg-gray-300 bg-[#02331E] w-full py-[18px] text-white rounded-xl font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
