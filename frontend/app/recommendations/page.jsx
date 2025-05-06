"use client";
import Footer from "@/CustomComponents/dashboard/footer/Footer";
import DatePicker from "@/CustomComponents/recommendations/datePicker";
import Products from "@/CustomComponents/recommendations/products";
import Image from "next/image";

export default function Recommendations() {
  return (
    <div>
      <div className="  pb-10 container md:mx-auto px-5 md:px-0 pt-3 bg-[#D4B038] text-white">
        <div>
          <p className="text-[35px] font-bold">Recommendation</p>
        </div>
        <div className="w-full flex justify-end">
          <Image
            src="/images/recommend.png"
            width={203}
            height={106}
            className="translate-y-2 "
          />
        </div>
      </div>
      <DatePicker />
      <Products />
      <Footer />
    </div>
  );
}
