import SteCard from "../cards/SteCard";
import Button from "@/app/CustomComponents/button/Button";
const images = ['/images/PitchIdea.png', '/images/launch.png', '/images/legalstaff.png', '/images/raisingmoney.png'];
const titles = ['Pitch your idea', 'Prepare for Launch', 'Sort out the legal stuff', 'Start raising money'];
const description = ['Invest in a range of startups across different industries or stages. ','Invest in a range of startups across different industries or stages. ','Invest in a range of startups across different industries or stages. ','Invest in a range of startups across different industries or stages. ']
export default function SteSection() {
  return (
    <div className="bg-custom-gradient pb-20">
      <div className="mb-10">
        <p className="text-[18px] md:text-[48px] font-bold text-center text-[#014367]">
          The Ni3mat Process—Simple, Transparent, Effective.
        </p>
        <p className="text-[18px] font-normal  text-[#545B79] text-center">
          From signup to successful fundraising, see how our platform works in
          just 4 easy steps:
        </p>
      </div>
      <div className=" flex flex-wrap gap-x-2 gap-y-8 md:gap-10 justify-center ">
        {[...Array(4)].map((_, index) => (
          <SteCard index={index + 1} key={index} images = {images[index]} titles={titles[index]} description = {description[index]} />
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <Button
          className="px-16 font-semibold  "
          title={"Get Started"}
        ></Button>
      </div>
    </div>
  );
}
