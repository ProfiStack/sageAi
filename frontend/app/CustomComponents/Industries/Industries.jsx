"use client";

import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Button } from "@/components/ui/button";
const images = [
  "/images/Ecommerce.png",
  "/images/logo0.png",
  "/images/logo8.png",
  "/images/logo1.png",
  "/images/logo2.png",
  "/images/logo3.png",
  "/images/logo3.png",
  "/images/logo4.png",
  "/images/logo9.png",
  "/images/logo5.png",
  "/images/logo6.png",
  "/images/logo7.png",
  "/images/logo3.png",
];
const text = [
  "Ecommerce",
  "Education",
  "Sustainability",
  "Web3",
  "Artifical Intelligence",
  "Women's Health",
  "Music",
  "Real Estate",
  "Fintech",
  "Technology",
  "Virtual Reality",
  "Mental Health",
  "Insurance",
];
export default function Industries() {
  const settings = {
    infinite: true, // Infinite loop
    speed: 1000, // Transition speed
    slidesToShow: 6, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll at once
    autoplay: true, // Auto-play the carousel
    autoplaySpeed: 100,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="pt-10 pb-10  md:ps-6 bg-white ">
      <div className=" px-2 md:px-0 ">
        <p className=" text-center text-[28px] md:text-[48px] font-normal text-[#014367]">
          Invest in what{" "}
          <span className="text-[28px] md:text-[48px] font-bold">inspires</span>{" "}
          you
        </p>
        <p className="flex justify-center text-center md:text-start text-[18px] font-[400px] mb-10 text-[#545B79] ">
          Find the industries you're passionate about and make a difference
          while growing your portfolio.
        </p>
      </div>
      <div className="relative md:hidden md:absolute">
        <Slider {...settings}>
          {text.map((_, index) => (
            <div key={index}>
              <Button className="text-[16px]  h-auto w-auto font-semibold p-3 rounded-[20px]  text-black border border-[#C3C5CE] ">
                <Image
                  src={images[index]}
                  width={40}
                  height={40}
                  alt="Ecommerce"
                  className="me-2 rounded-full"
                />
                {text[index]}
              </Button>
            </div>
          ))}
        </Slider>
      </div>
      <div className="hidden absolute md:flex md:justify-center md:h-max md:relative  md:gap-x-5">
        {text.slice(0, 6).map((_, index) => (
          <div key={index}>
            <Button className="text-[16px]  h-auto w-auto font-semibold p-3 rounded-[20px]  text-black border border-[#C3C5CE] ">
              <Image
                src={images[index]}
                width={40}
                height={40}
                alt="Ecommerce"
                className="me-2 rounded-full"
              />
              {text[index]}
            </Button>
          </div>
        ))}
      </div>
      <div className="hidden absolute md:flex md:justify-center md:h-max md:relative  md:gap-x-5 ">
        {text.slice(6).map((_, index) => (
          <div key={index + 6}>
            <Button className="text-[16px]  h-auto w-auto font-semibold p-3 rounded-[20px]  text-black border border-[#C3C5CE] mt-6 ">
              <Image
                src={images[index + 6]}
                width={40}
                height={40}
                alt="Ecommerce"
                className="me-2 rounded-full"
              />
              {text[index + 6]}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
