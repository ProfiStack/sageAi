"use client";
import Image from "next/image";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { usePathname, useRouter } from "next/navigation";
import { getAuthToken } from "@/shared/utils/utils";
import { useEffect, useState } from "react";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <div className="flex items-center justify-between py-2 md:py-7 container mx-auto px-5 md:px-0">
      {/* Logo */}
      <div
        className="flex justify-center items-center md:mb-0 cursor-pointer gap-[5px]"
        as="button"
        onClick={() => {
          router.push("/");
        }}
      >
        <div className="relative w-[20px] h-[20px] md:w-[34px] md:h-[38px] justify-center items-center">
          <Image
            src={"/images/sagelogo.png"}
            alt="logo"
            objectFit="contain"
            layout="fill"
          />
        </div>
        <p className="text-[20px] md:text-[24px] font-bold text-[#02331E]">
          SageeAi
        </p>
      </div>
      <div className=" items-center justify-center gap-[27px] hidden md:flex">
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
      <div className=" items-center hidden md:flex">
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
      <div className="flex md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <User fill="#C8DBCF" color="#C8DBCF" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User />
                <span>Profile</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                <span>Billing</span>
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Keyboard />
                <span>Keyboard shortcuts</span>
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Users />
                <span>Team</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <UserPlus />
                  <span>Invite users</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <Mail />
                      <span>Email</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare />
                      <span>Message</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <PlusCircle />
                      <span>More...</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem>
                <Plus />
                <span>New Team</span>
                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Github />
              <span>GitHub</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LifeBuoy />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Cloud />
              <span>API</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              <span>Log out</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
