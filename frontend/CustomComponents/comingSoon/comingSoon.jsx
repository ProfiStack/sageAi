"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function ComingSoon({ image }) {
  const router = useRouter();
  const handleToDashboard = () => {
    router.push("/home");
  };
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative w-full h-[260px] mb-6 rounded-[20px]">
        <Image
          src={image}
          alt="Coming Soon"
          layout="fill"
          objectFit="cover"
          className="rounded-[20px]"
        />
      </div>
      <p className="text-2xl font-bold text-[18px] text-center">Coming Soon</p>
      <p className="text-center text-sm ">
        We're working hard to bring you this feature. Stay tuned for updates!
      </p>
      <button
        onClick={handleToDashboard}
        className="bg-[#02331E] rounded-[20px] px-4 py-2 text-white mt-6"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
