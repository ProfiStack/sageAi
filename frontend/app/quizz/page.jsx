"use client";
import Results from "@/CustomComponents/home/results/Results";
import { Api } from "@/shared/api/api";
import { useQuizzStore } from "@/store/quizzStore";
import { Clock3, Handshake, Star, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function QuizzLandingPage() {
  const router = useRouter();
  const { setQuizzData, quizzData } = useQuizzStore();

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!quizzData) {
        try {
          const data = await Api.client.getQuizzes();
          setQuizzData(data.data);
        } catch (error) {
          console.error("Failed to fetch quizzes", error);
        }
      }
    };

    fetchQuizzes();
  }, [quizzData, setQuizzData]);
  const handleClick = () => {
    router.push("/quizz/primaryGoals");
  };
  return (
    <div>
      <div className=" flex items-center justify-center pt-1">
        <div className="relative h-[68px] w-[68px]">
          <Image src="/images/sagelogo2.png" objectFit="fill" layout="fill" />
        </div>
      </div>
      <hr className="w-full text-[#E5E5E5]" />
      <div className="px-4 bg-[#F9FAFB] pt-4">
        <div className="relative w-full h-[230px] rounded-xl">
          <Image
            src="/images/quizzLanding.png"
            objectFit="fill"
            layout="fill"
            className="rounded-2xl"
          />
        </div>
        <div className="space-y-2 my-4">
          <p className="text-[24px] font-bold text-[#02331E] leading-tight">
            Find Your Perfect Match Across Beauty, Fashion, Nutrition &
            Sustainability
          </p>
          <p className="text-sm text-[#121212]">
            Take a 2-minute quiz to unlock AI-powered recommendations tailored
            to your goals, values, and lifestyle.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white space-y-3">
          <div className="flex items-center gap-2">
            <Users fill="#D4B038" color="#D4B038" width={25} height={20} />
            <p className="font-bold ">500K+</p>
            <p className="">Personalized Routines</p>
          </div>
          <div className="flex items-center gap-2">
            <Star fill="#D4B038" color="#D4B038" width={25} height={20} />
            <p className="font-bold ">4.9/5</p>
            <p className="">Stars (20K Reviews)</p>
          </div>
          <div className="flex items-center gap-2">
            <Handshake fill="#D4B038" color="#D4B038" width={25} height={20} />
            <p className="font-bold ">300+</p>
            <p className="">Ethical Brand Partners</p>
          </div>
        </div>
        <div className="space-y-4 mt-4">
          <div className="p-4 rounded-xl bg-white">
            <div>
              <Image
                src="/images/idealProducts.png"
                width={27}
                height={24}
                className="mb-2"
              />
              <p className="font-bold  mb-1">
                Get Matched to Your Ideal Products
              </p>
              <p className="text-sm text-[#4B5563]">
                Personalized recommendations based on your unique needs
              </p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white">
            <div>
              <Image
                src="/images/recycle.png"
                width={27}
                height={24}
                className="mb-2"
              />
              <p className="font-bold mb-1">
                Reduce Waste with Smarter Choices
              </p>
              <p className="text-sm text-[#4B5563]">
                Make sustainable decisions that benefit our planet
              </p>
            </div>
          </div>{" "}
          <div className="p-4 rounded-xl bg-white">
            <div>
              <Clock3
                width={30}
                height={30}
                className="mb-1"
                fill="#D4B038"
                color="white"
              />
              <p className="font-bold mb-1">Save Time & Money</p>
              <p className="text-sm text-[#4B5563]">
                Efficient solutions that fit your budget
              </p>
            </div>
          </div>
        </div>
        <Results />
        <div className="text-white rounded-xl bg-[#02331E] space-y-2 p-[18px] flex flex-col items-center justify-center m">
          <p className="text-sm ">Together, we've saved</p>
          <p className="text-[24px] font-bold">1M+</p>
          <p className="text-sm">plastic bottles from landfills 🌍</p>
        </div>
      </div>
      <div className="mx-4 text-white rounded-xl py-[18px] flex justify-center items-center bg-[#02331E] my-4 ">
        <button onClick={() => handleClick()} className="font-bold ">
          Start Your Free Quiz Now
        </button>
      </div>
    </div>
  );
}
