"use client";
import Image from "next/image";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import LanguageIcon from "@mui/icons-material/Language";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/shared/utils/utils";
import { useEffect, useState } from "react";

export default function Header() {
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
    <div className="flex items-center py-7 mx-auto md:container md:mx-auto">
      {/* Logo */}
      <div
        className="flex items-center mb-4 md:mb-0 cursor-pointer"
        as="button"
        onClick={() => {
          router.push("/");
        }}
      >
        <div className="relative w-[60px] h-[40.62px] justify-center">
          <Image
            src={"/images/logo.png"}
            alt="logo"
            objectFit="contain"
            layout="fill"
          />
        </div>
      </div>

      {/* Navigation Links */}
      {/* <div className="relative ms-8 w-[210px]">
        <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#014367B2]"></i>
        <input
          type="text"
          className="pl-10 bg-[#8DA9C440] rounded-full px-4 w-full h-[40px] text-[#363636] placeholder-[#014367B2]"
          placeholder="Search"
        />
      </div> */}

      {/* Auth Links */}
      <div className="flex items-center gap-6 ms-auto">
        {/* Language */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-[#014367] transition-all duration-30"
          as="button"
          onClick={() => {
            console.log("Language changed");
          }}
        >
          <LanguageIcon />
          <p className="text-[20px]">EN</p>
        </div>
        {!authToken && (
          <>
            <Link
              href="/login"
              className="text-[20px] cursor-pointer hover:text-[#014367] transition-all duration-30"
            >
              Login
            </Link>
            <button
              onClick={handleOnClick}
              className="text-[20px] cursor-pointer hover:text-[#014367] transition-all duration-30"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
}
