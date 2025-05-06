import Image from "next/image";
import Hero from "./hero/Hero";
import PopularUsers from "./popularUsers/PopularUsers";
import FeaturesInDemand from "./features/Features";
import Footer from "./footer/Footer";

export default function Dashboard() {
  return (
    <div>
      <div className="flex justify-between items-center pb-10 container md:mx-auto px-5 md:px-0 pt-3 bg-[#D4B038] text-white">
        <div>
          <p className="text-[25px] font-bold">Welcome</p>
          <p>Susan Clay</p>
        </div>
        <Image src="/images/sageLogo2.png" width={70} height={70} />
      </div>
      <Hero />
      <PopularUsers />
      <FeaturesInDemand />
      <Footer />
    </div>
  );
}
