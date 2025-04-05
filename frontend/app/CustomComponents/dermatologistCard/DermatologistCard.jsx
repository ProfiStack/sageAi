import Image from "next/image";
export default function DermatologistCard() {
  return (
    <div className="py-4 px-3 rounded-2xl shadow-[0px_2px_2px_rgb(0,0,0,0.1)] w-[350px] md:w-[496px] space-y-3">
      <div className=" flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="relative w-[90px] md:w-[104px] h-[97px]">
            <Image src="/images/jessica.png" objectFit="cover" layout="fill" />
          </div>
          <div className="flex flex-col justify-center md:gap-2  ">
            <p className="font-bold text-[14px] md:text-[16px]">
              Dr. Jessica Turner
            </p>
            <p className="text-[#4B5563] text-[12px] md:text-[16px]">
              Certified Dermatologist
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className=" w-[36px] h-[36px] md:w-[56px] md:h-[56px] rounded-full bg-[#F3F4F6] flex justify-center items-center">
            <Image src="/images/medal.png" width={30} height={30} />
          </div>
          <p className="text-[12px] ">3+experience</p>
        </div>
      </div>
      <p className="text-[#4B5563]">
        What impresses me most about SageeAI is how it translates complex
        dermatological science into practical, personalized recommendations. The
        system considers factors that even in clinical practice we might
        overlook
      </p>
    </div>
  );
}
