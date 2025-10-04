"use client";
import React, { useEffect, useState } from "react";
import { Info, User, LogOut, LogIn, Wallet } from "lucide-react";
import Footer from "@/CustomComponents/Footer/Footer";
import Image from "next/image";
import Link from "next/link";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { isUserLoggedIn } from "@/lib/utils";
import { Api } from "@/shared/api/api";
import LogoutPopup from "../Popups/LogoutPopup";

export default function ProfilePageContent() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const loadProfile = async () => {
      try {
        const profileData = await Api.client.getProfile(token);
        if (profileData?.name) {
          setUserName(profileData.name);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [token, isAuthenticated]);

  const handleLogout = () => {
    setIsOpen(true);
  };

  const menuItems = [
    {
      icon: User,
      label: "Personal Details",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      href: "/profile/personal-details",
    },
    ...(isUserLoggedIn()
      ? [
          {
            icon: LogOut,
            label: "Log Out",
            bgColor: "bg-red-50",
            iconColor: "text-red-600",
            isButton: true,
            onClick: handleLogout,
          },
        ]
      : [
          {
            icon: LogIn,
            label: "Log In",
            bgColor: "bg-green-50",
            iconColor: "text-green-600",
            isButton: true,
            onClick: () => router.push("/"),
          },
        ]),
    /* {
      icon: Wallet,
      label: "Subscription",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      href: "/subscription",
    },*/
    {
      icon: Info,
      label: "About Us",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      href: "/about",
    },
  ];

  const supportItems = [
    /* {
      icon: MessageSquare,
      label: "Feedback",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      href: "/profile/feedback",
    },*/
  ];

  return (
    <div className="h-screen bg-gray-50 max-w-md mx-auto flex flex-col justify-between ">
      <div>
        <SettingsHeader title="Profile" />

        <div>
          {/* Profile Section */}
          <div className=" px-6 py-4 text-center">
            <div className="relative inline-block mb-1">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-200 to-orange-200 flex items-center justify-center border-4 border-white shadow-lg">
                <User size={48} className="text-gray-400" />
              </div>
            </div>

            {isLoading ? (
              <div className="h-6 bg-gray-200 rounded w-32 mx-auto animate-pulse  mb-2 mt-2" />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isAuthenticated && userName ? userName : "guest user"}
              </h2>
            )}
          </div>

          {/* Account Section */}
          <div className="px-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account
            </h3>
            <div className="space-y-3">
              {menuItems.map((item, index) =>
                item.isButton ? (
                  <button
                    key={index}
                    className="w-full flex items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    onClick={item.onClick}
                  >
                    <div className={`p-2 rounded-[10px] ${item.bgColor} mr-4`}>
                      <item.icon size={20} className={item.iconColor} />
                    </div>
                    <span className="text-gray-900 font-medium flex-1 text-left">
                      {item.label}
                    </span>
                  </button>
                ) : (
                  <Link
                    key={index}
                    href={item.href}
                    className="w-full flex items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className={`p-2 rounded-[10px] ${item.bgColor} mr-4`}>
                      <item.icon size={20} className={item.iconColor} />
                    </div>
                    <span className="text-gray-900 font-medium flex-1 text-left">
                      {item.label}
                    </span>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Support Section 
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
          <div className="space-y-3">
            {supportItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="w-full flex items-center  p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`p-2 rounded-[10px] ${item.bgColor} mr-4`}>
                  <item.icon size={20} className={item.iconColor} />
                </div>
                <span className="text-gray-900 font-medium flex-1 text-left">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
          
        </div>
        */}

          {/* SageeAi Logo */}
          <div className="flex items-center justify-center absolute left-[40%] bottom-[77px]">
            <Image
              src="/images/sagelogo2.png"
              alt="SageeAi"
              width={78}
              height={78}
            />
          </div>
        </div>
      </div>

      <Footer />

      <LogoutPopup isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Bottom padding to account for fixed navigation */}
    </div>
  );
}
