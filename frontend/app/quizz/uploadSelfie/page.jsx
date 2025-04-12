"use client";
import QuizzHeader from "@/CustomComponents/quizzHeader/QuizzHeader";
import { useRouter } from "next/navigation";
import { Images } from "lucide-react";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { useQuizzStore } from "@/store/quizzStore";

export default function UploadSelfie() {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const { answers } = useQuizzStore();
  const [selfie, setSelfie] = useState(() => {
    return answers.selfie ? answers.selfie : "";
  });
  const router = useRouter();
  const { setAnswers } = useQuizzStore();
  const handleNext = () => {
    setAnswers("selfie", selfie);
    router.push("/quizz/skinType");
  };
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelfie(file);
    }
  };

  return (
    <div className="h-screen flex justify-between flex-col bg-[#FAFAFA]">
      <div>
        <div className="bg-white">
          <QuizzHeader barWidth={35} pageNumber={2} />
        </div>
        <div className="px-4">
          <div>
            <p className="text-2xl text-[#02331E] font-bold leading-tight pb-2">
              Let us analyse your skin using AI. Upload a selfie in good
              lighting.
            </p>
            <p className="text-[#525252]">
              Our AI will identify your skin type, key issues (redness, dark
              spots, wrinkles, or dullness), and pore size to create a
              personalised routine.
            </p>
          </div>
          <div className="py-16 px-5 rounded-xl bg-white my-5 flex items-center justify-center gap-20 text-[#525252] text-center ">
            <div onClick={() => fileInputRef.current.click()}>
              <div className="relative h-[64px] w-[64px] cursor-pointer space-y-2 ">
                <input
                  ref={fileInputRef}
                  className="h-full w-full hidden"
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                />
                <Images className="h-full w-full" />
              </div>
              <label className="text-sm ">Upload Selfie</label>
            </div>
            <div onClick={() => cameraInputRef.current.click()}>
              <div className="relative h-[64px] w-[64px] cursor-pointer space-y-2 ">
                <input
                  ref={cameraInputRef}
                  className="h-full w-full hidden"
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleImage}
                />
                <Camera className="h-full w-full" />
              </div>
              <label className="text-sm">Take Selfie</label>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-t-[#E5E5E5] sticky inset-0 bg-white">
        <button
          onClick={handleNext}
          // disabled={selectedOptions.length === 0}
          className="disabled:bg-gray-300 bg-[#02331E] w-full py-[18px] text-white rounded-xl font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
