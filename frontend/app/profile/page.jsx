"use client";
import React, { useState } from "react";
import {
  Info,
  User,
  FileText,
  MessageCircle,
  LogOut,
  MessageSquare,
  LogIn,
  Camera,
} from "lucide-react";
import Footer from "@/CustomComponents/Footer/Footer";
import Image from "next/image";
import Link from "next/link";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { isUserLoggedIn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuthStore();
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuItems = [
    {
      icon: User,
      label: "Personal Details",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      href: "/profile/personal-details",
    },
    {
      icon: FileText,
      label: "Results",
      bgColor: "bg-purple-50",
      iconColor: " text-purple-600",
      href: "/result",
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
  ];

  const supportItems = [
    {
      icon: MessageSquare,
      label: "Feedback",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      href: "/profile/feedback",
    },

    {
      icon: Info,
      label: "About Us",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      href: "/about",
    },
  ];

  return (
    <div className="h-screen bg-gray-50 max-w-md mx-auto ">
      <SettingsHeader title="Profile" />

      <div>
        {/* Profile Section */}
        <div className=" px-6 py-4 text-center">
          <div className="relative inline-block mb-1">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-200 to-orange-200 flex items-center justify-center border-4 border-white shadow-lg">
                <User size={48} className="text-gray-400" />
              </div>
            )}

            {/* Upload Button */}
            <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <Camera size={16} className="text-gray-600" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isAuthenticated ? "User" : "Guest User"}
          </h2>
        </div>

        {/* Account Section */}
        <div className="px-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account</h3>
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

        {/* Support Section */}
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

        {/* SageeAi Logo */}
        <div className="flex items-center justify-center ">
          <Image
            src="/images/sagelogo2.png"
            alt="SageeAi"
            width={78}
            height={78}
          />
        </div>
      </div>

      <Footer />

      {/* Bottom padding to account for fixed navigation */}
    </div>
  );
}
