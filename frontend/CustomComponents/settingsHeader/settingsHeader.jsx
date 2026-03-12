"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SettingsHeader({ title }) {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <div className="bg-[#fafafa] sticky top-0  px-2 py-1 flex items-center justify-between shadow-sm">
      <button onClick={handleBack} className="p-1">
        <ArrowLeft size={24} className="text-gray-700" />
      </button>
      <h1 className="text-xl font-semibold text-[#02331e]">{title}</h1>
      <Image src="/images/sagelogo2.png" alt="SageeAi" width={58} height={58} />
    </div>
  );
}
