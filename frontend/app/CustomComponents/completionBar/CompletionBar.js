import { cn } from "@/lib/utils";

export default function CompletionBar({ completionPercentage, className }) {
  // Calculate the completion percentage

  return (
    <div
      className={cn(
        "w-full bg-gray-200 rounded-full  overflow-hidden",
        className
      )}
    >
      <div
        className="bg-[#34C759CC] text-xs font-medium text-white text-center p-1 h-full"
        style={{ width: `${completionPercentage.toFixed(0)}%` }}
      ></div>
    </div>
  );
}
