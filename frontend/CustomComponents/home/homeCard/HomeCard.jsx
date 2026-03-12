import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePostHog } from "@/app/providers/posthogProvider";

export default function HomeCard({ item }) {
  const router = useRouter();
    const { logEvent } = usePostHog();

 const handleCategoryClick = (item) => {
  
    // logEvent("Home Option Selected", {
      // item_title: item.title,
     //});

    router.push(item.route)
  };

  return (
    <button
      onClick={()=>handleCategoryClick(item)}
      className="group relative flex-1 flex flex-col overflow-hidden rounded-2xl border-b-4 border-yellow-500 shadow-2xl bg-white cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="absolute inset-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02331E]/80 via-[#02331E]/30 to-transparent" />
      </div>

      <div className="relative mt-auto p-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl text-start font-bold text-white tracking-wide uppercase">
            {item.title}
          </h2>
          <p className="text-white/80 text-sm font-light text-start">
            {item.description}
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
          <ArrowRight size={20} />
        </div>
      </div>
    </button>
  );
}