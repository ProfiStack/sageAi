import Footer from "./Footer/Footer";
import Header from "../header/Header";
import DermatologistVerified from "./dermatologistVerified/DermatologistVerified";
import GuessWork from "./guessWork/GuessWork";
import Hero from "./Hero/Hero";
import Results from "./results/Results";
import SkinDecoded from "./skinDecoded/SkinDecoded";
import Solutions from "./solutions/Solutions";
import SubHero from "./subHero/SubHero";
import WellnessJourney from "./wellnessJourney/WellnessJourney";

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <div className="order-1 ">
        <Header />
      </div>
      <div className="order-2">
        <Hero />
      </div>
      <div className="order-3">
        <SubHero />
      </div>
      <div className="order-7 md:order-4">
        <SkinDecoded />
      </div>
      <div className="order-5">
        <Solutions />
      </div>
      <div className="order-6">
        <DermatologistVerified />
      </div>
      <div className="order-8 md:order-7">
        <WellnessJourney />
      </div>
      <div className="order-4 md:order-8">
        <Results />
      </div>
      <div className="order-9">
        <GuessWork />
      </div>
      <div className="order-10">
        <Footer />
      </div>
    </div>
  );
}
