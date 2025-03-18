"use client";
import Image from "next/image";
import Header from "../../CustomComponents/header/Header";
import Footer from "../../CustomComponents/Footer/Footer";
import { Typography } from "@mui/material";
import { Check } from "lucide-react";
export default function Success() {
  return (
    <div className="mx-4 md:container md:mx-auto ">
      <Header />
      <div className="md:grid md:grid-cols-2">
        <div className="">
          <div className="my-8 md:my-20">
            <Image
              src={"/images/Star1.svg"}
              width={68}
              height={68}
              className="w-[48px] md:w-[68px]"
              alt="Star"
            />
            <div className="flex items-center gap-4">
              <h1 className="text-[30px] md:text-[48px] font-bold text-[#014367]">
                Thank you for applying{" "}
              </h1>
              <span className="bg-[#34C759] p-2 rounded-full w-min h-min">
                <span className="h-[0px] w-[0px]">
                  <Check size={30} color="white" strokeWidth="4px" />
                </span>
              </span>
            </div>
            <Typography className="text-[#1D1B20] text-[18px] md:text-[24px]">
              Your application has been successfully submitted{" "}
              <br className="hidden md:flex" /> to the Naimaat team. We’ll
              review it and respond <br className="hidden md:flex" /> within a
              couple of business days.
            </Typography>

            <div className="flex justify-center md:justify-start my-4">
              <button className="w-[100%] h-[45px] md:w-[220px] md:h-[60px] bg-[#014367] rounded-[8px] text-white text-[18px] md:text-[24px] font-medium hover:bg-[#023450] transition duration-30">
                My Portfolio
              </button>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center">
          <Image
            src={"/images/SuccessImage.svg"}
            width={600}
            height={1000}
            alt="Success Image"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
