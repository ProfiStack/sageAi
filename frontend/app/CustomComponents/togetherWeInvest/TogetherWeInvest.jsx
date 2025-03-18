import Image from "next/image";
import Link from "next/link";
export default function TogetherWeInvest() {
  return (
    <div className="flex justify-between gap-5 md:ps-[111px] md:pe-[50px] px-4 pt-10  ">
      <div>
        <div>
          <p className="text-[30px] mb-2 md:text-[48px] font-bold text-[#014367] w-auto md:w-[548px] leading-tight">
            Together We Invest, Together We Thrive. Naimaat Brings It to Life.
          </p>
          <p className="text-[18px] font-[400px] text-[#545B79] w-auto md:w-[610px]">
            Naimaat, meaning "blessing" in Arabic, and we are on a mission to
            democratize investment in the MENA region. We want to empower
            individuals to invest confidently while providing startups with
            crowdfunding solutions to fuel their growth. Join us in turning
            blessings into opportunities and driving economic development.
          </p>
        </div>
        <div className="flex justify-center md:justify-start gap-5 mt-10">
          {/* <button className="text-[16px] font-bold px-5 md:px-[50px] py-2 md:py-[9px] bg-[#14315D] rounded-[10px] text-white">
            Explore Startups
          </button> */}
          <Link href={'/startup/application'} className="text-[16px] font-bold px-5 md:px-[50px] md:py-[9px] py-2 border-2 border-[#14315D] rounded-[10px] ">
            {" "}
            Raise Money
          </Link>
        </div>
      </div>
      <div className="hidden md:grid grid-cols-2 gap-x-2 ">
        <Image
          className="pb-5"
          alt="image"
          src={"/images/jhon.png"}
          width={262}
          height={240}
        />
        <Image
          className="translate-y-[-30px]"
          alt="image"
          src={"/images/yasin.png"}
          width={298}
          height={242}
        />
        <Image alt="image" src={"/images/majid.png"} width={267} height={254} />
        <Image
          className="translate-y-[-35px]"
          alt="image"
          src={"/images/ahmed.png"}
          width={300}
          height={256}
        />
      </div>
    </div>
  );
}
