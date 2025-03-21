"use client";
import Image from "next/image";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import LanguageIcon from "@mui/icons-material/Language";
import { usePathname, useRouter } from "next/navigation";
import { getAuthToken } from "@/shared/utils/utils";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About us", href: "/about" },
    { label: "Categories", href: "/categories" },
    { label: "Contact us", href: "/contact" },
  ];
  const router = useRouter();
  const [authToken, setAuthToken] = useState(null);

  const handleOnClick = () => {
    router.push("/signup");
  };

  useEffect(() => {
    const getAuth = async () => {
      const authToken = await getAuthToken();
      setAuthToken(authToken);
    };
    getAuth();
  });

  return (
    <div className="flex items-center justify-between  py-7 mx-auto md:container md:mx-auto">
      {/* Logo */}
      <div
        className="flex justify-center items-center mb-4 md:mb-0 cursor-pointer gap-[5px]"
        as="button"
        onClick={() => {
          router.push("/");
        }}
      >
        <div className="relative w-[34px] h-[38px] justify-center">
          <Image
            src={"/images/sagelogo.png"}
            alt="logo"
            objectFit="contain"
            layout="fill"
          />
        </div>
        <p className="text-[24px] font-bold text-[#02331E]">SageeAi</p>
      </div>
      <div className="flex items-center justify-center gap-[27px]">
        {navLinks.map((link) => (
          <div key={link.href} className="flex justify-center items-center ">
            <button
              type="button"
              className={` text-base text-black ${pathname === link.href ? "font-bold" : "font-normal"}`}
            >
              {link.label}
            </button>
          </div>
        ))}
      </div>

      {/* Auth Links */}
      <div className="flex items-center ">
        {!authToken && (
          <>
            <button
              onClick={handleOnClick}
              className="text-[20px] font-semibold text-[] py-3 px-[23px] rounded-[999px] bg-[#02331E] text-white "
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
}
