"use client";
import React, { useEffect, useState } from "react";
import {
  Info,
  User,
  LogOut,
  LogIn,
  Wallet,
  SquarePen,
  CircleUser,
} from "lucide-react";
import Footer from "@/CustomComponents/Footer/Footer";
import Image from "next/image";
import Link from "next/link";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { isUserLoggedIn } from "@/lib/utils";
import { Api } from "@/shared/api/api";
import LogoutPopup from "../Popups/LogoutPopup";
import { profile } from "@tensorflow/tfjs";

export default function ProfilePageContent() {
  const router = useRouter();
  const { isAuthenticated, token, name } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  console.log(profileData);

  useEffect(() => {
    setIsLoading(true);
    const loadProfile = async () => {
      try {
        const res = await Api.client.getProfile(token);
        setProfileData(res);
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
            onClick: () => router.push("/login"),
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

  const data = [
    { label: "Skin Type:", value: profileData?.skin_type },
    { label: "Concern:", value: profileData?.concern },
    { label: "Makeup Goal:", value: profileData?.makeup_goal },
    { label: "Hair Type:", value: profileData?.hair_type },
    { label: "Hair Concern:", value: profileData?.hair_concern },
    { label: "Lifestyle:", value: profileData?.lifestyle },
    { label: "Preferred Routine:", value: profileData?.preferred_routine },
    { label: "Nutrition Goal:", value: profileData?.nutrition_goal },
    { label: "Dietary Restriction:", value: profileData?.dietary_restriction },
    { label: "Wellness Focus:", value: profileData?.wellness_focus },
    { label: "Dedicated time:", value: profileData?.dedicate_time },
    { label: "Style Preference:", value: profileData?.style_preference },
    { label: "Styling Goal:", value: profileData?.styling_goal },
  ];

  return (
    <div className="">
      <SettingsHeader title={"Profile"} />
      <div className="p-4 bg-[#FAFAFA]">
        <div className="w-full bg-white border border-[#FFFFFF01] p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <CircleUser size={30} />
              <p className="font-semibold">{profileData?.name}</p>
            </div>
            <SquarePen size={20} />
          </div>
          <div className="flex overflow-x-auto gap-2 mt-4">
            {data.map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-center gap-2 bg-gray-50 rounded-xl p-2 border border-gray-100 shadow-sm"
              >
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {label}
                </span>
                <span className="font-medium text-xs text-gray-800">
                  {value && value !== "Unknown" ? value : "N/A"}
                </span>
              </div>
            ))}
          </div>

          <div></div>
        </div>
      </div>

      <Footer />

      <LogoutPopup isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
