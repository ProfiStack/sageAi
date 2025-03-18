import Image from "next/image";
import { cn } from "@/lib/utils";
export default function Card({
  className,
  subClassName,
  image,
  title,
  description,
  width,
  height,
}) {
  return (
    <div
      className={cn(
        "  border border-gray-200 rounded-[12px] bg-gray-50 shadow-[2px_2px_12px_0px_rgba(0,0,0,0.15)]    ",
        subClassName,
        className
      )}
    >
      <Image src={image} width={width} height={height} alt="Substack" />
      <div className="p-3">
        <p className="text-base font-semibold">{title}</p>
        <p className="text-[14px] ">{description}</p>
      </div>
      <div className="flex items-center gap-3 px-3 pb-3">
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold"> 18h : 21m : 08s</p>
          <p className="text-[14px]">Remaining Time</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold">29.71 ETH</p>
          <p className="text-[14px]"> Current Bid</p>
        </div>
      </div>
    </div>
  );
}
