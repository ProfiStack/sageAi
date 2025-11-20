"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { MobileMockup } from "./MobileMockup";
import QRCodeModal from "@/CustomComponents/Popups/QrCode";

const faqCategories = [
  {
    id: "skincare",
    title: "Skincare & Beauty",
    questions: [
      "Which sunscreen is best for humid weather?",
      "Which sunscreen is best for dry, desert climates?",
      "Which sunscreen is best for cold, snowy winters?",
      "What is the best moisturiser for dry winters globally?",
      "Which vitamin C serums are available in USA, UK, UAE, India/Pakistan, EU, and Canada?",
      "What are the top anti aging creams available worldwide?",
      "Do I need SPF on cloudy or rainy days globally?",
      "How can I check if a skincare product is safe for my skin type?",
      "What's the best skincare routine for oily, dry, or sensitive skin in hot vs. cold climates?",
      "Which retinols are beginner-friendly in different regions?",
      "How can I tell if a viral TikTok skincare product is worth trying?",
      "Which global brands are dermatologist recommended and available in multiple regions?",
      "How can I layer skincare products correctly for maximum results?",
      "What is the best skincare routine for oily skin in hot climates?",
      "What is the best skincare routine for dry skin in cold climates?",
      "How do I choose between chemical vs. mineral sunscreen for different climates?",
      "Which ingredients are banned or regulated differently in US vs. EU vs. Asia?",
      "Which viral TikTok skincare trends are actually safe?",
      "How can I find halal-certified or vegan skincare brands worldwide?",
    ],
  },
  {
    id: "haircare",
    title: "Haircare & Styling",
    questions: [
      "Which keratin treatments are safest and available worldwide?",
      "What are the best shampoos for hard water globally?",
      "How can I reduce frizz in humid weather?",
      "Which haircare brands are vegan and cruelty free globally?",
      "What's the best scalp treatment for dandruff or buildup?",
      "How can I repair heat damaged hair naturally?",
      "Which hair vitamins actually work and are safe?",
      "What's the best brush for curly hair?",
      "What is the best hair routine for curly hair in dry vs humid climates?",
      "How do I pick the right shampoo and conditioner for my hair type?",
      "Which hair vitamins are actually effective and safe worldwide?",
    ],
  },
  {
    id: "fitness",
    title: "Fitness & Wellness",
    questions: [
      "What is the best beginner-friendly workout plan for busy professionals?",
      "How can I work out effectively at home without equipment?",
      "Which fitness apps work globally?",
      "What are the best fitness apps for women?",
      "How can I stay motivated to exercise?",
      "How do I stay motivated to exercise during winter or Ramadan or Christmas or festive seasons?",
      "What is the best morning routine for better mental health?",
      "How do I start a meditation practice as a beginner?",
      "Which yoga or meditation practices are good for stress relief worldwide?",
      "How do I create a healthy morning routine that works in any time zone?",
      "How can I maintain wellness routines while traveling internationally?",
    ],
  },
  {
    id: "nutrition",
    title: "Nutrition & Lifestyle",
    questions: [
      "Which plant-based protein powders are best worldwide?",
      "Which region-specific protein powders are best (US, UK, India, UAE, Canada, EU)?",
      "What's a healthy weekly meal plan for busy professionals worldwide?",
      "How can I eat healthy on a budget globally?",
      "How do I adapt my diet for local cuisine when traveling?",
      "What are the best snacks for glowing skin?",
      "Which supplements are worth taking for better hair, skin, and nails?",
      "What are the best hydration tips for better skin health?",
      "How do I manage sugar cravings while working long hours?",
      "What food support healthy skin and hair?",
      "Which supermarkets have the best organic produce globally?",
      "Which restaurants are best for vegan food by region (London, Dubai, Mumbai, NYC, Toronto)?",
    ],
  },
  {
    id: "makeup",
    title: "Makeup, Fashion & Lifestyle",
    questions: [
      "Which makeup brands are cruelty-free and affordable globally?",
      "Which foundations work best in humid vs dry climates?",
      "What are the best subscription boxes for skincare in the UK?",
      "Which perfumes under $50 / £50 / AED 200 are best worldwide?",
      "What makeup works best in humid UK weather?",
      "How can I build a sustainable wardrobe on a budget worldwide?",
      "How do I find my perfect foundation shade online?",
      "What are the latest global makeup trends right now?",
      "Which fashion rental services are available in major cities worldwide?",
      "What are the best multipurpose beauty products for frequent travelers?",
    ],
  },
  {
    id: "health",
    title: "Health & Medical Lifestyle",
    questions: [
      "How can I check a mole at home before seeing a doctor?",
      "How do I know if a mole needs medical attention?",
      "What tele-dermatology services are available worldwide?",
      "How can I find trustworthy dermatologists globally?",
      "What's the difference between NHS and private mole checks?",
      "When should I see a doctor for acne, rashes, or skin infections?",
      "What are key differences between US, UK, EU, and Asia skincare regulations?",
      "What are official recommendations for sun safety in different regions?",
    ],
  },
  {
    id: "ai",
    title: "AI & Smart Recommendations",
    questions: [
      "How can SageeAI analyze my skin and give me a custom routine?",
      "How does SageeAI recommend makeup shades without a live try on?",
      "Is SageeAI data private and secure?",
      "Can SageeAI help me find trending but safe beauty products?",
      "How does SageeAI recommend products for different regions?",
      "Can SageeAI check ingredient compliance for US, EU, and Asia regulations?",
      "Can SageeAI detect fake vs authentic products?",
      "How does SageeAI personalize routines for different skin tones and types globally?",
    ],
  },
];

export function FAQSection() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isQrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isInView =
          rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
        setIsVisible(isInView);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onClose = () => {
    setQrOpen(false);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative py-32 bg-gradient-to-b from-white to-[#F5F5F5] overflow-hidden"
    >
      <QRCodeModal isOpen={isQrOpen} onClose={onClose} />
      {/* Background decorative elements with parallax */}
      <div
        className="absolute top-40 right-10 w-80 h-80 bg-[#D4B038] rounded-full mix-blend-multiply opacity-5 blur-3xl"
        style={{
          transform: `translateY(${(scrollY - 2800) * 0.15}px)`,
        }}
      ></div>
      <div
        className="absolute bottom-40 left-10 w-96 h-96 bg-[#02331E] rounded-full mix-blend-multiply opacity-5 blur-3xl"
        style={{
          transform: `translateY(${(scrollY - 3200) * 0.12}px)`,
        }}
      ></div>

      {/* Parallax Mobile Mockups */}
      <div
        className="absolute top-20 -left-10 opacity-35  transition-all duration-300"
        style={{
          transform: `translateY(${(scrollY - 2600) * 0.25}px) rotate(${-10 - (scrollY - 2600) * 0.008}deg) scale(${1 - (scrollY - 2600) * 0.00006})`,
          filter: `blur(${Math.max(0, (scrollY - 2800) * 0.005)}px)`,
          willChange: "transform, filter",
        }}
      >
        <MobileMockup variant="scan" />
      </div>

      <div
        className="absolute bottom-20 -right-10 opacity-35  transition-all duration-300"
        style={{
          transform: `translateY(${(scrollY - 3000) * 0.22}px) rotate(${12 + (scrollY - 3000) * 0.01}deg) scale(${1 + (scrollY - 3000) * 0.00008})`,
          filter: `blur(${Math.max(0, (scrollY - 3200) * 0.005)}px)`,
          willChange: "transform, filter",
        }}
      >
        <MobileMockup variant="products" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl text-[#02331E] mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-[#121212] max-w-3xl mx-auto opacity-80">
            Get instant answers to your beauty, wellness, and lifestyle
            questions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="skincare" className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 h-auto bg-white/50 p-2 mb-8">
              {faqCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-[#02331E] data-[state=active]:text-white text-sm py-3 px-4 rounded-lg transition-all flex-shrink-0"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {faqCategories.map((category, categoryIndex) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="mt-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
                >
                  <h3 className="text-2xl text-[#02331E] mb-6">
                    {category.title}
                  </h3>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((question, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${categoryIndex}-${index}`}
                        className="border-b border-gray-200 last:border-0"
                      >
                        <AccordionTrigger className="text-left text-[#121212] hover:text-[#02331E] py-4 text-base">
                          {question}
                        </AccordionTrigger>
                        <AccordionContent className="text-[#121212] pb-4 opacity-80">
                          <div className="bg-[#F5F5F5] rounded-xl p-4 border-l-4 border-[#D4B038]">
                            <p className="mb-3">
                              This is a question our AI agent SageeAI can answer
                              with personalized, science-backed recommendations
                              tailored to your location, skin type, and
                              preferences.
                            </p>
                            <p className="text-sm text-[#02331E]">
                              💡 Join SageeAI today to get instant access to
                              expert answers!
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center bg-gradient-to-br from-[#02331E] to-[#024029] rounded-3xl p-12 shadow-xl"
        >
          <h3 className="text-3xl text-white mb-4">
            Can't find your question?
          </h3>
          <p className="text-white/90 text-lg mb-6">
            SageeAI can answer thousands more questions about beauty, wellness,
            and lifestyle
          </p>
          <button
            onClick={() => {
              setQrOpen(true);
            }}
            className="inline-block bg-[#D4B038] text-[#121212] px-8 py-4 rounded-full hover:bg-[#D4B038]/90 transition-all"
          >
            Join SageeAI Today
          </button>
        </motion.div>
      </div>
    </section>
  );
}
