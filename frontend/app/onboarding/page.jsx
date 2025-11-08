"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const OnboardingCarousel = () => {
  const router = useRouter();
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const slides = [
    {
      title: "Snap Selfie",
      description: "We'll guide your framing for the best analysis.",
      image: "/images/snapSelfie.png",
    },
    {
      title: "Shade Match",
      description: "Non-invasive analysis with instant feedback.",
      image: "/images/shades.png",
    },
    {
      title: "Report",
      description: "Understand ingredients, triggers, and routines.",
      image: "/images/instantReport.png",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex pt-[100px] justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-[20px] h-max">
        <div className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-b-[#D1D5DB]">
            <div className="flex items-center gap-3">
              <div className="relative w-[40px] h-[40px]">
                <Image
                  src={"/images/sagelogo.png"}
                  objectFit="contain"
                  layout="fill"
                />
              </div>
              <div>
                <h1 className="font-bold text-lg">SageeAI</h1>
                <p className="text-sm text-gray-500">Beauty & Wellness</p>
              </div>
            </div>
            <button
              className="text-gray-500"
              onClick={() => {
                router.push("/");
              }}
            >
              Skip
            </button>
          </div>

          {/* Carousel */}
          <div className="p-8">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {slides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className="flex flex-col items-center text-left space-y-6">
                      <div className="relative h-[192px] w-[201px]">
                        <Image
                          src={slide.image}
                          objectFit="contain"
                          layout="fill"
                        />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {slide.title}
                        </h2>
                        <p className="text-gray-600">{slide.description}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all ${
                    current === index ? "w-8 bg-[#02331E]" : "w-2 bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="ghost"
                onClick={() => api?.scrollPrev()}
                disabled={current === 0}
                className="text-gray-600 disabled:opacity-0"
              >
                Back
              </Button>
              <Button
                onClick={() =>
                  current === slides.length - 1
                    ? router.push("/")
                    : api?.scrollNext()
                }
                className="bg-[#02331E] rounded-[12px] hover:bg-[#02331E] text-white px-8"
              >
                {current === slides.length - 1 ? "Get Started" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCarousel;
