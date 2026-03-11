"use client";
import React, { useEffect, useState } from "react";
import { Info, LogOut, LogIn, SquarePen, CircleUser } from "lucide-react";
import Footer from "@/CustomComponents/Footer/Footer";

import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { cn, isUserLoggedIn } from "@/lib/utils";
import { Api } from "@/shared/api/api";
import LogoutPopup from "../Popups/LogoutPopup";
import ScanPopup from "../Popups/ScanPopup";
import FavouritesPopup from "../Popups/Favourites";

export default function ProfilePageContent() {
  const router = useRouter();
  const { isAuthenticated, token, name, userId } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [dayRoutine, setDayRoutine] = useState(null);
  const [nightRoutine, setNightRoutine] = useState(null);
  const [favourites, setFavourites] = useState(null);
  const [scanPopup, setScanPopup] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedFavourite, setSelectedFavourite] = useState(null);

  const handleOpenPopup = (favourite) => {
    setSelectedFavourite(favourite);
    setIsPopupOpen(true);
  };

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

  const data = [
    { label: "Skin Type:", value: profileData?.skin_type },
    { label: "Concern:", value: profileData?.concern },
    { label: "Makeup Goal:", value: profileData?.makeup_goal },
    { label: "Hair Type:", value: profileData?.hair_type },
    { label: "Hair Concern:", value: profileData?.hair_concern },
    { label: "Nutrition Goal:", value: profileData?.nutrition_goal },
    { label: "Dietary Restriction:", value: profileData?.dietary_restriction },
    { label: "Wellness Focus:", value: profileData?.wellness_focus },
    { label: "Dedicated time:", value: profileData?.dedicate_time },
    { label: "Style Preference:", value: profileData?.style_preference },
    { label: "Styling Goal:", value: profileData?.styling_goal },
  ];

  useEffect(() => {
    const handleFavourites = async () => {
      try {
        const res = await Api.client.getFavourites(token, userId);

        const routineData = res?.find(
          (item) => item.user_favourites?.day_routine
        );

        const productData = res.filter(
          (item) => item.user_favourites?.products
        );

        setDayRoutine(routineData?.user_favourites?.day_routine || []);
        setNightRoutine(routineData?.user_favourites?.night_routine || []);
        setFavourites(productData || []);
      } catch (error) {
        console.error("Error fetching favourites:", error);
      }
    };

    handleFavourites();
  }, [token, userId]);

  const handleScanPopup = () => {
    setScanPopup(!isOpen);
  };

  return (
    <div className=" flex flex-col justify-between h-screen bg-[#FAFAFA]">
      <div>
        <SettingsHeader title={"Profile"} />
        <div className="p-4 bg-[#FAFAFA]">
          <div className="w-full bg-white border border-[#FFFFFF01] p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <CircleUser size={30} />
                <p className="font-semibold">
                  {profileData?.name ? profileData?.name : "Guest User"}
                </p>
              </div>
              <SquarePen
                size={20}
                onClick={() => {
                  router.push("/profile/personal-details");
                }}
              />
            </div>
            <div className="flex overflow-x-auto gap-2 mt-4 pb-3  scrollbar-thin scrollbar-thumb-[#02331E]/60   ">
              {data.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-1 justify-between items-center gap-2 bg-gray-50 rounded-xl p-2 border border-gray-100 shadow-sm"
                >
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {label}
                  </span>
                  <span className=" font-medium text-xs text-gray-800 whitespace-nowrap">
                    {value && value !== "Unknown" ? value : "N/A"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-4 bg-[#FAFAFA]">
          <div className="p-4 rounded-xl  bg-white border border-[#FFFFFF01] shadow-sm">
            <p className="font-semibold text-sm">Saved Routines</p>

            {dayRoutine?.length > 0 && nightRoutine?.length > 0 ? (
              <div className="flex items-start justify-between gap-3">
                <div className="mt-3">
                  <p className="text-sm font-medium">AM Routine</p>
                  {dayRoutine?.map((step, index) => (
                    <div key={index} className=" flex gap-2 space-y-3">
                      <div className="mt-2">•</div>
                      <p className="text-xs text-[#525252]">
                        {step?.replace(/^Step \d+ - /, "")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 ">
                  <p className="text-sm font-medium">PM routine</p>
                  {nightRoutine?.map((step, index) => (
                    <div key={index} className="flex gap-2 space-y-3  ">
                      <div className="mt-2">•</div>
                      <p className="text-xs text-[#525252]">
                        {step?.replace(/^Step \d+ - /, "")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center">
                <button
                  onClick={handleScanPopup}
                  className=" p-4 mt-3 rounded-xl font-semibold text-white bg-[#02331E] text-sm"
                >
                  Scan to add routines
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-[#FAFAFA]">
          <div className="p-4 rounded-xl  bg-white border border-[#FFFFFF01] shadow-sm">
            <p className="font-semibold text-sm">Favourites</p>

            {favourites?.length > 0 ? (
              <div className="flex gap-4 pt-3 overflow-x-auto pb-3  scrollbar-thin scrollbar-thumb-[#02331E]/60">
                {favourites?.map((favourite, index) => {
                  const fav = favourite.user_favourites.products;
                  return (
                    <button
                      onClick={() => handleOpenPopup(favourite)}
                      className="p-3 w-[150px] flex-shrink-0 rounded-lg bg-[#FAFAFA] flex flex-col items-start justify-start "
                    >
                      {/*<p className="text-sm font-medium">{fav.brand}</p>*/}
                      {fav?.shade ? (
                        <div>
                          <p className="text-sm font-medium pt-1">
                            {fav?.product}
                          </p>
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-medium pt-1">Shade:</p>
                            <p className="text-sm font-medium pt-1">
                              {fav?.shade}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm font-medium pt-1 text-start">
                          {fav?.name}:
                        </p>
                      )}
                      <p className="text-xs font-medium pt-1 text-[#737373] text-start">
                        {fav?.perfect_for}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="w-full flex items-center justify-center">
                <button
                  onClick={handleScanPopup}
                  className="p-4 mt-3 rounded-xl font-semibold text-white bg-[#02331E] text-sm"
                >
                  Scan to add favourites
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-[#FAFAFA]">
          <div className="p-4 space-y-4 rounded-xl  bg-white border border-[#FFFFFF01] shadow-sm">
            <button
              className=" font-medium flex items-center gap-2"
              onClick={() => {
                router.push("/about");
              }}
            >
              <Info size={20} />
              About
            </button>

            <button
              className={cn(
                " font-medium flex items-center gap-2",
                isUserLoggedIn(userId) ? "text-red-400" : "text-green-800"
              )}
              onClick={() => {
                if (isUserLoggedIn(userId)) {
                  handleLogout();
                } else {
                  router.push("/login");
                }
              }}
            >
              {isUserLoggedIn(userId) ? (
                <LogOut size={20} color="red" />
              ) : (
                <LogIn size={20} color="green" />
              )}
              {isUserLoggedIn(userId) ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </div>
      <div className="sticky inset-0">
        <Footer />
      </div>
      <FavouritesPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        favourite={selectedFavourite}
      />

      <LogoutPopup isOpen={isOpen} setIsOpen={setIsOpen} />
      <ScanPopup isOpen={scanPopup} setIsOpen={setScanPopup} />
    </div>
  );
}
