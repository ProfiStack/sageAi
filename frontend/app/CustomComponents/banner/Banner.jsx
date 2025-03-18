import Card from "../cards/Card";
import ExploreButton from "../button/Button";
const images =[ '/images/synthesis-card.webp.png','/images/substack-card.webp.png','/images/mercury-card.webp.png','/images/replit-card.webp.png']
 export default function Banner() {
  const cardStyles = [
    "transform translate-y-[-7rem]", // Elevation for the first card
    "mr-[250px]", // Middle card
    "ml-[250px]", // Middle card
    "transform translate-y-[-7rem]", // Elevation for the last card
  ];
  return (
    <div className="relative flex justify-center items-start overflow-hidden h-[520px] md:h-[574px]  ">
       <div
        className="absolute inset-0 bg-cover md:bg-contain bg-center opacity-50 flex w-full h-full" // Apply opacity and fit
        style={{
          backgroundImage: `url('images/background.jpeg')`,
        }}
      ></div>
      {/* Center Text */}
      <div className="absolute z-10 text-center mt-10 ">
        <div className="flex  flex-col w-full items-center ">
          <p className="text-[50px] font-bold w-auto max-w-[626px] mb-[13px] text-[#014367] leading-tight">
            Be Part of the Future. Invest in Founders Today.
          </p>
          <div className="text-base font-normal w-auto max-w-[353px] mb-8 text-[#545B79]  ">
            Invest in projects that matter while making a difference in the
            world.{" "}
          </div>
          <ExploreButton title="Explore Startups" />
        </div>
        <div className="flex w-auto gap-1 ms-4  md:gap-4 justify-center">
          <div className="w-auto max-w-[126px]">
            <p className="text-left text-2xl font-semibold">3M+</p>
            <p className="text-left text-[#666]">Investor Community</p>
          </div>
          <div className="w-auto max-w-[126px]">
            <p className="text-left text-2xl font-semibold">2,500+</p>
            <p className="text-left text-[#666]">Ventures supported</p>
          </div>
          <div className="w-auto max-w-[126px]">
            <p className="text-left text-2xl font-semibold">31</p>
            <p className="text-left text-[#666]">Unicorns in portfolio</p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex gap-x-4 items-end translate-y-48  flex-shrink-0">
        {[...Array(4)].map((_, index) => (
          <Card
            key={index}
            title="Residence Rybna"
            description="@UA real estate agency"
            image={images[index]}
            subClassName={cardStyles[index]} // Apply specific styles based on the card's index
            className="pr-1"
            width={277}
            height={208}
          />
        ))}
      </div>
    </div>
  );
}
