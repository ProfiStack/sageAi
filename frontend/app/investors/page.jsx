import Header from "../CustomComponents/header/Header";

import InvestorBanner from "../CustomComponents/banner/InvestorsBanner";
import FounderClub from "../CustomComponents/founderClub.jsx/FounderClub";
import Community from "../CustomComponents/community/Community";
import Industries from "../CustomComponents/Industries/Industries";
import SteSection from "../CustomComponents/steSection/SteSection";
import Struggle from "../CustomComponents/struggle/Struggle";
import Footer from "../CustomComponents/Footer/Footer";
import KnowCustomer from "../CustomComponents/knowCustomer/KnowCustomer";
import SubSignup from "../CustomComponents/subSignUp/SubSignup";
export default function Investors() {
  return (
    <div className="overflow-x-auto">
      <Header />
      <InvestorBanner />
      <FounderClub />
      <Community />
      <Industries />
      <SteSection />
      <Struggle />
      <KnowCustomer />
      <SubSignup sub />
      <hr className="border-t-[1px] border-[#E5E7EB] w-full pt-10 pb-10 bg-[#F3F4F6]" />
      <Footer />
    </div>
  );
}
