"use client";

import { useRef } from "react";
import Footer from "./CustomComponents/Footer/Footer";
import Header from "./CustomComponents/header/Header";
import Hero from "./CustomComponents/Hero/Hero";
import Industries from "./CustomComponents/Industries/Industries";
import NewToInvesting from "./CustomComponents/newToInvesting/NewToInvesting";
import StayInformed from "./CustomComponents/stayInformed/StayInformed";
import TogetherWeInvest from "./CustomComponents/togetherWeInvest/TogetherWeInvest";
import TrendingDeals from "./CustomComponents/trendingDeals/TrendingDeals";
import WhyInvest from "./CustomComponents/whyInvest/WhyInvest";

export default function Home() {
  const trendingDealsRef = useRef(null);

  const scrollToTrendingDeals = () => {
    trendingDealsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="mx-4 md:container md:mx-auto overflow-x-hidden">
      <Header />
      <Hero onButtonClick={scrollToTrendingDeals} />
      <TrendingDeals ref={trendingDealsRef} />
      <Industries
        title={"Invest in what inspires you"}
        description={
          "Find the industries you're passionate about and make a difference while growing your portfolio."
        }
      />
      <WhyInvest />
      <NewToInvesting />
      <TogetherWeInvest />
      <StayInformed />
      <Footer />
    </div>
  );
}
