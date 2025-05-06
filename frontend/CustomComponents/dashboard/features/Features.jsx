import Image from "next/image";

export default function FeaturesInDemand() {
  return (
    <div className="my-4">
      <p className="mb-2 text-[22px] font-semibold text-[#545454] ps-2">
        Features in demand
      </p>
      <div className="grid grid-cols-2 gap-2 px-2 font-medium">
        <button className="flex gap-2 items-center p-2  py-4 px-3 bg-[#D4B0384D] rounded-2xl">
          <Image src="/images/validate.png" width={53} height={53} />
          <p className="w-min text-start">Validate Viral products </p>
        </button>
        <button className="flex gap-2 items-center p-2  bg-[#02331EB2] py-4 px-3 rounded-2xl">
          <div className="relative w-[73px] h-[73px]">
            <Image src="/images/existing.png" objectFit="fill" layout="fill" />
          </div>
          <p className="text-start">
            Check your
            <br /> existing
            <br /> product
            <br /> work for you{" "}
          </p>
        </button>
      </div>
    </div>
  );
}
