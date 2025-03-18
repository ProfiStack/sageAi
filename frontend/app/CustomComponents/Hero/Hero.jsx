"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import CompletionBar from "../completionBar/CompletionBar";
import { Api } from "@/shared/api/api";

function SliderDiv() {
  return (
    <div className="grid grid-row-2 justify-center items-center my-4 md:my-0">
      <div className="rounded-t-[20px] overflow-hidden">
        <Image
          src={"/images/startup1.png"}
          alt="Banner"
          width={750}
          height={400}
        />
      </div>
      <div className="p-4 md:p-6 mb-2 rounded-b-[20px] shadow-md md:w-[750px]">
        <div className="flex gap-4 items-center">
          <Image
            className="w-[40px] md:w-[60px] rounded-[26px]"
            src={"/images/Logo_Bici_sfondo_blu.png"}
            alt="Logo"
            width={60}
            height={60}
          />
          <div className="flex justify-between w-full items-center">
            <div>
              <h1 className="font-bold text-[20px] md:text-[28px]">
                Fantacycling
              </h1>
              <p
                className="text-[#545B79] text-[10px] md:text-[14px] leading-6 uppercase mt-[-7px]"
                style={{ width: "200px" }}
              >
                Sports and Fitness
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <div className="flex rounded-full py-1 px-2 md:px-3 md:py-2 items-center bg-[#34C75920]">
                <span className="text-[#34C759] text-[8px] md:text-[12px] font-semibold">
                  76%
                </span>
              </div>
              <p className="font-semibold text-[8px] md:text-[14px]">
                AED 76,000
              </p>
            </div>
          </div>
        </div>
        <p className="mt-2 text-[10px] md:text-[16px]">
          Fantacycling is a fantasy sports platform dedicated to cycling and a
          media hub for cycling news. Users can create virtual teams, compete by
          following global events, and access exclusive content.
        </p>
        {/* progress bar */}
        <div className="mt-4 overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#ECECEC]">
          <div
            style={{ width: "76%" }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#34C759]"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ onButtonClick }) {
  const [startupData, setStartupData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.client.getStartups();
        console.log(response);
        setStartupData(response || []);
        s;
      } catch (error) {
        console.error("Error fetching startups data:", error);
      }
    };
    fetchData();
  }, []);
  const settings = {
    dots: true,
    lazyLoad: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
  };
  return (
    <div>
      <div className="md:grid md:grid-cols-2 md:gap-4 md:mt-16 md:mb-12">
        <div className="flex flex-col h-min">
          <h1 className="text-[26px] md:text-[58px]">
            Be Part of the{" "}
            <span className="font-bold text-[#014367]">Future.</span>
          </h1>
          <h1 className="md:my-[-10px] text-[26px] md:text-[58px]">
            Invest in Founders Today
          </h1>
          <p className="text-[#545B79] text-[14px] md:text-[22px]">
            Invest in projects that matter while making a difference in the
            world.{" "}
          </p>
          <div className="md:flex grid items-center mt-4">
            <button
              onClick={onButtonClick}
              className="my-2 md:my-0 bg-[#014367] text-white md:px-12 py-2 md:py-3 md:mt-4 rounded-[10px] font-semibold hover:bg-[#0D2B3E] transition duration-30 ease-in-out"
            >
              Explore Startups
            </button>
            <Link
              href={"/signup"}
              className="text-center bg-[#EEF4ED] text-[#014367] py-2 md:px-12 md:py-3 md:mt-4 rounded-[10px] font-semibold hover:bg-[#DBDFDA] transition duration-30 ease-in-out md:ms-4"
            >
              Join Naimaat
            </Link>
          </div>
        </div>
        <SliderDiv />
      </div>

      {/* Bento grid */}
      <div className="md:grid md:grid-cols-5 md:grid-rows-5 md:gap-4 w-full my-8">
        <div className="my-4 p-4 md:p-0 md:my-0 col-span-2 row-span-1 col-start-1 row-start-1 bg-[#EEF4ED] rounded-[20px] flex items-center justify-center">
          <Image
            src={"/images/Naimaat-full-logo.png"}
            alt="Naimaat Logo"
            className="w-[250px] md:w-[350px]"
            width={350}
            height={200}
          />
        </div>
        <div
          className="my-4 md:my-0 col-span-2 row-span-4 col-start-1 row-start-2 p-4 rounded-[20px]"
          style={{
            backgroundImage: `url('/images/gradient.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex items-center justify-end p-4">
            <Image
              src={"/images/star.png"}
              alt="Star"
              className="w-[30px] md:w-[50px]"
              width={50}
              height={50}
            />
          </div>
          <h1 className="p-4 mt-[-24px] text-white text-[24px] md:text-[40px] font-medium tracking-widest leading-tight text=[#EEF4ED]">
            Blessings in every investment for a thriving {/* break */}
            <br />
            <span className="font-bold">MENA.</span>
          </h1>

          <p className="p-4 text-[#EEF4ED] text-[12px] md:text-[18px] mt-4 w-[85%]">
            Naimaat, meaning "blessing" in Arabic, and we are on a mission to
            democratize investment in the MENA region.
          </p>
        </div>
        <div className="my-4 md:my-0 col-span-1 row-span-2 col-start-3 row-start-1 p-4 bg-[#8DA9C4] rounded-[20px]">
          <div className="flex justify-end items-center mx-5">
            <Image
              src={"/images/gmail_groups.png"}
              alt="Rocket"
              className="w-[50px] md:w-[78px]"
              width={78}
              height={78}
            />
          </div>
          <div className="mt-10">
            <h1 className="text-[#EEF4ED] text-[22px] md:text-[40px] font-bold my-[-10px]">
              3M+
            </h1>
            <p className="text-[#EEF4ED] text-[18px] md:text-[24px]">
              Investor Community
            </p>
          </div>
        </div>
        <div className="my-4 md:my-0 col-span-1 row-span-1 col-start-3 row-start-3 p-4 bg-[#EEF4ED] rounded-[20px] ">
          <h1 className="text-[#014367] text-[22px] md:text-[40px] font-bold my-[-10px]">
            $2.5B+
          </h1>
          <p className="text-[#014367] text-[18px] md:text-[24px]">
            Capital Raised
          </p>
        </div>
        <div className="my-4 md:my-0 col-span-1 row-span-2 col-start-3 row-start-4 p-4 bg-[#EEF4ED] rounded-[20px]">
          <div className="flex justify-end items-center mx-6">
            <Image
              src={"/images/unicorn.png"}
              alt="Rocket"
              className="w-[60px] md:w-[95px]"
              width={95}
              height={95}
            />
          </div>
          <div className="mt-10">
            <h1 className="text-[#014367] text-[22px] md:text-[40px] font-bold my-[-10px]">
              31
            </h1>
            <p className="text-[#014367] text-[18px] md:text-[24px]">
              Unicorns in Portfolio
            </p>
          </div>
        </div>
        <div className="my-4 md:my-0 col-span-2 row-span-5 col-start-4 row-start-1 p-8 bg-[#EEF4ED] rounded-[20px]">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[#014367] text-[26px] md:text-[40px] font-bold">
                Rising Deals
              </h1>
              <p className="text-[#014367] text-[12px] md:text-[20px]">
                See what's trending now on Naimaat
              </p>
            </div>
            <div className="mx-10">
              <Image
                src={"/images/faArrowTrendUp.png"}
                alt="Rocket"
                className="w-[35px] md:w-[49px]"
                width={49}
                height={49}
              />
            </div>
          </div>
          {startupData.slice(0, 4).map((data) => (
            <div className="mt-4">
              <div className="bg-white rounded-[20px] p-4">
                <div className="flex items-center gap-4">
                  <div className="w-[30px] md:w-[60px]">
                    <Image
                      src={data.logo}
                      alt="Startup"
                      width={100}
                      height={100}
                      className="rounded-[23px]"
                    />
                  </div>
                  <div className="w-[85%]">
                    <div className="grid grid-cols-2 md:gap-4">
                      <div>
                        <h1 className="text-[18px] md:text-[24px] md:mb-[-6px]">
                          {data.companyName}
                        </h1>
                        <p className="text-[#545B79] text-[10px] md:text-[14px] md:mb-[-6px]">
                          {data.industry}
                        </p>
                      </div>
                      <div className="flex flex-col justify-end items-end">
                        {/* 76% */}
                        <div className="flex rounded-full px-2 py-1 md:px-3 md:py-2 items-center bg-[#34C75920]">
                          <span className="text-[#34C759] text-[8px] md:text-[12px] font-semibold">
                            {(
                              (data.moneyRaised / data.moneyToBeRaised) *
                              100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>
                        <p className="font-semibold text-[10px] md:text-[14px]">
                          AED {data.moneyRaised}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 overflow-hidden h-2  text-xs flex rounded bg-[#ECECEC]">
                      <CompletionBar
                        completionPercentage={
                          (data.moneyRaised * data.moneyToBeRaised) / 100
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
