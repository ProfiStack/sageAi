"use client";
import QuizzHeader from "@/CustomComponents/quizzHeader/QuizzHeader";
import { useRouter } from "next/navigation";
import { Images } from "lucide-react";
import { Camera } from "lucide-react";
import { useRef } from "react";
import { useQuizzStore } from "@/store/quizzStore";
import Image from "next/image";

export default function UploadSelfie() {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const { setAnswers, answers, quizzData } = useQuizzStore();

  const selfie = answers?.selfie?.previewUrl;
  const router = useRouter();
  const data = quizzData?.[1];

  const handleNext = () => {
    router.push("/quizz/skinType");
  };
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAnswers("selfie", { file, previewUrl });
    }
  };
  const handleOnChange = () => {
    setAnswers("selfie", "");
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
              {data?.title}
            </p>
            <p className="text-[#525252]">{data?.description}</p>
          </div>

          {selfie ? (
            <div className="py-4 px-5 rounded-xl bg-white my-5 flex flex-col items-center justify-center gap-2 text-[#525252] text-center ">
              <div className="relative w-[200px] h-[200px] rounded-full">
                <Image
                  src={selfie}
                  alt="selfie"
                  objectFit="cover"
                  layout="fill"
                  className="rounded-full"
                />
              </div>
              <div>
                <button
                  onClick={() => handleOnChange()}
                  className="text-[14px] font-bold bg-[#02331E] rounded-2xl mt-2 py-2 px-6 text-white"
                >
                  Change Selfie
                </button>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      <div className="p-4 border-t border-t-[#E5E5E5] sticky inset-0 bg-white">
        <button
          onClick={handleNext}
          disabled={!selfie}
          className="disabled:bg-gray-300 bg-[#02331E] w-full py-[18px] text-white rounded-xl font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
