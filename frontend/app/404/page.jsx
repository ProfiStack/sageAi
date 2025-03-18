"use client";
import Header from "../CustomComponents/header/Header";
import Footer from "../CustomComponents/Footer/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";



export default function Page404() {
    const router = useRouter();
  return (
    <div className="mx-auto min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-[#014367] text-[48px] font-medium">
        404 Page Not Found
      </h1>
      <button
        className="bg-[#014367] text-white px-12 py-4 rounded-[20px] mt-4 transition duration-300 ease-in-out hover:bg-[#0d2f4e]"
      onClick={() => router.push("/")}>
        Home
      </button>
    </div>
  );
}
