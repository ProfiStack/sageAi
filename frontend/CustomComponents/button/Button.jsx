import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function ExploreButton({ title, className }) {
  return (
    <button
      className={cn(
        "text-base font-bold  px-6 py-[9px] bg-[#014367] text-white rounded-[10px] mb-8",
        className
      )}
    >
      {title} <ArrowRight className="ml-2" size={18} />{" "}
    </button>
  );
}
