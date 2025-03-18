"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "../../CustomComponents/header/Header";
import Footer from "../../CustomComponents/Footer/Footer";
import { Typography } from "@mui/material";

const dummyData = {
  amount: 1000,
  currency: "AED",
  date: "2024-10-16",
  transactionID: "N358946",
};

export default function Success() {
  return (
    <div className="mx-4 md:container md:mx-auto">
    <Header />
    <div className="md:grid md:grid-cols-2">
    <div className="">
      <div className="my-8 md:my-20">
        <Image src={'/images/Star1.svg'} width={68} height={68} className="w-[48px] md:w-[68px]" alt="Star" />
        <div className="flex">
          <h1 className="text-[48px] font-bold text-[#014367]">Thank you!</h1>
          <div className="w-3"></div>
          <Image src={'/images/Party-Popper.svg'} width={48} height={48} alt="Success Emoji" />
        </div>
        <Typography className="text-[#1D1B20] text-[18px] md:text-[24px]">
          Your payment has been successfully processed.
        </Typography>
        <div className="my-4 grid grid-cols-2 md:w-[50%]">
          {/* Amount, Date, TransactionID */}
          <div>
            <Typography className="my-2 font-medium text-[#124074] text-[24px]">
              Amount
            </Typography>
            <Typography className="my-2 font-medium text-[#124074] text-[24px]">
              Date
            </Typography>
            <Typography className="my-2 font-medium text-[#124074] text-[24px]">
              Transaction ID
            </Typography>
          </div>
          <div>
            <Typography className="my-2 text-[#1D1B20] text-[24px]">
              {dummyData.currency}{" "}
              {Intl.NumberFormat().format(dummyData.amount)}
            </Typography>
            <Typography className="my-2 text-[#1D1B20] text-[24px]">
              {new Date(dummyData.date).toLocaleDateString("en-GB")}
            </Typography>
            <Typography className="my-2 text-[#1D1B20] text-[24px]">
              {dummyData.transactionID}
            </Typography>
          </div>
        </div>
        <div className="my-4">
          <Typography className="text-[#1D1B20] font-light text-[16px] md:text-[24px] w-[100%]">
            Thank you for investing with Naimaat, take a moment to view your
            portfolio and see how your contribution is helping shape the future!{" "}
          </Typography>
        </div>
        <div className="flex justify-center md:justify-start my-4">
          <button className="w-[100%] h-[45px] md:w-[220px] md:h-[60px] bg-[#014367] rounded-[8px] text-white text-[18px] md:text-[24px] font-medium hover:bg-[#023450] transition duration-30">
            My Portfolio
          </button>
          </div>
      </div>

    </div>
    <div className="hidden md:flex items-center justify-center">
      <Image src={'/images/SuccessImage.svg'} width={600} height={1000} alt="Success Image" />
    </div>
    </div>
    <Footer />

    </div>
  );
}
