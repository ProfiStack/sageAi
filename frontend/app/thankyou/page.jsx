'use client'
import Image from "next/image"
import { useState } from "react";

const backgroundImage = '/images/investorBanner.png'
export default function (){
    const [isCopied, setIsCopied] = useState(false);
    const text = ("https://naimaat.com/invite");

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
        // Show the notification
        setIsCopied(true);
        // Hide the notification after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      });
  };
    return (
        <div className="bg-thankyou-gradient h-screen pt-10  ">
            <div
        className="relative bg-contain md:bg-contain bg-center  w-screen h-auto   " // Apply opacity and fit
        style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            layout: "fill",
        }}
      >
        <div className="w-full h-full flex justify-center items-center ">
        <div className="relative w-[100px] h-[100px] md:h-[200px] md:w-[200px] mr-4 md:mr-10">
    <Image src='/images/logo.png' objectFit="contain" layout="fill" />
    </div>
    </div>

      </div>
      <div className="flex flex-col items-center gap-6  mr-2 md:mr-10 pt-14   ">
        <p className=" text-[#014367] text-[12px] md:text-[28px] font-bold">YOU DID IT</p>
        <p className=" text-[#014367] text-[18px] md:text-[38px] font-bold">THANK YOU FOR SIGNING UP</p>
        <p className="text-[#014367] text-[12px] md:text-[28px] font-bold flex flex-wrap w-auto md:w-[790px] ml-2 md:text-start text-center">You are the lucky one to Invite your friends  5 exclusive invites for you to share to invite people  to join this journey!</p>
      <div className="flex">
        <p className="w-auto bg-white border border-gray-100 p-2 rounded-[8px] text-[12px] md:text-[20px]">{text}</p>
        <div className="relative">
        <button className="text-[12px] md:text-[20px] font-bold  bg-[#014367] h-full w-full px-2 rounded-[8px] text-white " onClick={handleCopy}>COPY LINK</button>
        {isCopied && (
        <div className="absolute top-[-30px] left-2 md:left-7 md:text-[14px] text-[10px]    bg-gray-800 text-white text-sm py-1 px-2 rounded">
          Copied!
        </div>
      )}
        </div>
      </div>
      </div>
        </div>
    )
}