"use client";

import Footer from "./CustomComponents/Footer/Footer";
import Header from "./CustomComponents/header/Header";
import Hero from "./CustomComponents/Hero/Hero";
import SubHero from "./CustomComponents/subHero/SubHero";
import SkinDecoded from "./CustomComponents/skinDecoded/SkinDecoded";
import Solutions from "./CustomComponents/solutions/Solutions";
import DermatologistVerified from "./CustomComponents/dermatologistVerified/DermatologistVerified";
import WellnessJourney from "./CustomComponents/wellnessJourney/WellnessJourney";
import Results from "./CustomComponents/results/Results";
import GuessWork from "./CustomComponents/guessWork/GuessWork";

export default function Home() {
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
      <div className="order-3 md:order-8">
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
