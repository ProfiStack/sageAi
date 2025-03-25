import Image from "next/image";
export default function DermatologistCard() {
  return (
    <div className="py-4 px-3 rounded-2xl shadow-[0px_14px_16px_rgb(0,0,0,0.1)] w-[496px] space-y-3">
      <div className=" flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="relative w-[104px] h-[97px]">
            <Image src="/images/jessica.png" objectFit="cover" layout="fill" />
          </div>
          <div className="flex flex-col justify-center gap-2  ">
            <p className="font-bold">Dr. Jessica Turner</p>
            <p className="text-[#4B5563]">Certified Dermatologist</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className=" w-[56px] h-[56px] rounded-full bg-[#F3F4F6] flex justify-center items-center">
            <Image src="/images/medal.png" width={30} height={30} />
          </div>
          <p>3+experience</p>
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
