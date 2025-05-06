import { Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Products() {
  const router = useRouter();
  const handleProductClick = (id) => {
    router.push(`/product-details/${id}`);
  };
  return (
    <div className="mb-4 -translate-y-4">
      {Array.from({ length: 10 }).map((_, index) => {
        return (
          <div
            key={index}
            className=" mb-3 border border-gray-300 rounded-2xl mx-3"
          >
            <button
              type="button"
              onClick={() => handleProductClick(index)}
              className="flex items-center justify-between w-full p-4"
            >
              <div className="flex gap-2 items-center">
                <div className="relative w-[74px] h-[74px]">
                  <Image
                    src="/images/vitamin.png"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-start">Vitamin C </p>
                  <div className="flex items-center gap-3">
                    <p className="text-[#758599] text-xs font-medium py-2 px-3 border border-[#758599] rounded-2xl">
                      step 1
                    </p>
                    <div className="flex items-center gap-[6px] text-[#758599] font-medium">
                      {" "}
                      <Clock color="#758599" size={24} /> 7:00 AM
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 rounded-full bg-black"></div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
