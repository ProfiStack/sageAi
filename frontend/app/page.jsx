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
    <div className="overflow-x-hidden">
      <Header />
      <Hero />
      <SubHero />
      <SkinDecoded />
      <Solutions />
      <DermatologistVerified />
      <WellnessJourney />
      <Results />
      <GuessWork />
      <Footer />
    </div>
  );
}
