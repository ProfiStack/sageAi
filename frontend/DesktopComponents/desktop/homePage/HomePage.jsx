import { AboutSection } from "@/DesktopComponents/homePage/About";
import { ComingSoonSection } from "@/DesktopComponents/homePage/ComingSoon";
import { CTASection } from "@/DesktopComponents/homePage/Cta";
import { FAQSection } from "@/DesktopComponents/homePage/Faq";
import { FeaturesSection } from "@/DesktopComponents/homePage/Features";
import { FloatingElements } from "@/DesktopComponents/homePage/FloatingElements";
import { Footer } from "@/DesktopComponents/homePage/Footer";
import { HeroSection } from "@/DesktopComponents/homePage/Hero";
import { MissionSection } from "@/DesktopComponents/homePage/Mission";
import { Navbar } from "@/DesktopComponents/homePage/Navbar";

export default function HomePage() {
  return (
    <div className=" bg-[#F5F5F5] relative ">
      <Navbar />
      <FloatingElements />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <ComingSoonSection />
        <MissionSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
