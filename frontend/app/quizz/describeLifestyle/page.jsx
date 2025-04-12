"use client";
import QuizzHeader from "@/CustomComponents/quizzHeader/QuizzHeader";
import { useQuizzStore } from "@/store/quizzStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SpecificConcerns() {
  const { answers } = useQuizzStore();
  const { setAnswers } = useQuizzStore();
  const [selectedOptions, setSelectedOptions] = useState(() => {
    return answers.describeLifestyle ? answers.describeLifestyle : [];
  });
  const router = useRouter();

  const options = [
    "Urban Dweller",
    "Active Lifestyle",
    "Frequent Travel",
    "Desk/Indoor Worker",
  ];

  const handleChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };
  const handleNext = () => {
    setAnswers("describeLifestyle", selectedOptions);
    router.push("/quizz/specificConcerns");
  };
  return (
    <div>
      <QuizzHeader barWidth={65} pageNumber={4} />

      <div className="bg-[#FAFAFA] px-4">
        <div>
          <p className="text-2xl text-[#02331E] font-bold">
            What specific concerns would you like to address?
          </p>
          <p className="text-[#525252]">
            Select all that apply to your skin condition
          </p>
        </div>
        <div className="space-y-4 pt-3 mb-4">
          {options.map((option, index) => {
            return (
              <button
                onClick={() => handleChange(option)}
                className={`${selectedOptions.includes(option) ? "bg-[#E5F8F8]" : "bg-white"} w-full py-3 px-4 flex gap-4 items-center rounded-[12px] border border-[#E5E5E5]`}
                key={index}
              >
                <div className="relative w-[15px] h-[20px] ">
                  <Image
                    src="/images/primaryGoals.png"
                    objectFit="contain"
                    layout="fill"
                  />
                </div>
                <div>
                  <p className=" text-[#02331E] flex justify-start">{option}</p>
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
