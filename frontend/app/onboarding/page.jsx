"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

const slides = [
  {
    title: "Chat",
    description:
      "Talk to a dedicated AI expert for every area of your skincare, makeup, product analysis, styling, and more. Each bot is trained for its domain so every answer is relevant, accurate, and personal to you.",
    video: "/videos/chat.mp4",
  },
  {
    title: "Skin Analysis",
    description:
      "Upload a photo and let AI analyse it instantly. Whether it's your skin for a derm-level breakdown or a look for shade and style matching. Deep analysis across every category, in seconds.",
    video: "/videos/skin-analysis.mp4",
  },
  {
    title: "Report",
    description:
      "Every analysis you do generates a full personalised report of skincare routines, product recommendations, shade matches, and lifestyle tips all tailored to you. Your complete lifestyle guide, in one place.",
    video: "/videos/report.mp4",
  },
];

const OnboardingCarousel = () => {
  const router = useRouter();
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef([]);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === current) {
        v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [current]);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Carousel setApi={setApi} className="w-full h-full">
        <CarouselContent contentWrapperClassName="h-full" className="h-full ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-full pl-0 relative">
              {/* Full-screen video */}
              <div className="absolute top-0 left-0 w-full h-[78%]">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={slide.video}
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-fill"
                />
              </div>

              {/* SVG curved gradient — anchored to bottom, extends upward beyond content area */}
              <svg
                className="absolute left-0 w-full z-10"
                style={{ bottom: 0, height: '48%' }}
                preserveAspectRatio="none"
                viewBox="0 0 414 497"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M216.68 82.6622C373.357 66.2324 437.337 22.0775 459 0V497H-6.99997V139.653C15.3344 126.133 91.3386 95.806 216.68 82.6622Z"
                  fill={`url(#grad-${index})`}
                />
                <defs>
                  <linearGradient
                    id={`grad-${index}`}
                    x1="371.845"
                    y1="27.2118"
                    x2="-93.559"
                    y2="424.592"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#02331E" />
                    <stop offset="0.928142" stopColor="#D4B038" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 h-[35%] z-20 px-8 flex flex-col justify-between pb-12">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-3">
                    {slide.title}
                  </h2>
                  <p className="text-sm text-white/80 italic leading-relaxed">
                    {slide.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => api?.scrollTo(i)}
                        className={`h-2 rounded-full transition-all ${
                          current === i ? "w-6 bg-white" : "w-2 bg-white/30"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => router.push("/")}
                      className="text-white/60 text-sm font-medium"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() =>
                        current === slides.length - 1
                          ? router.push("/")
                          : api?.scrollNext()
                      }
                      className="bg-white text-[#02331E] font-bold px-6 py-3 rounded-xl text-sm tracking-wide"
                    >
                      {current === slides.length - 1 ? "GET STARTED" : "NEXT"}
                    </button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default OnboardingCarousel;
