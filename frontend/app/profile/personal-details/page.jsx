"use client";
import React, { useState, useEffect } from "react";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import useAuthStore from "@/store/authStore";
import { Api } from "@/shared/api/api";
import useFormToast from "@/CustomComponents/FormToast/FormToast";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";

export default function PersonalDetailsPage() {
  const { primaryToast, destructiveToast } = useFormToast();

  const { token, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    skin_type: "",
    concern: "",
    makeup_goal: "",
    nutrition_goal: "",
    dietary_restriction: "",
    wellness_focus: "",
    dedicate_time: "",
    hair_type: "",
    hair_concern: "",
    style_preference: "",
    styling_goal: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [initialFormData, setInitialFormData] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setIsLoadingProfile(false);
        return;
      }
      try {
        const profileData = await Api.client.getProfile(token);
        if (profileData) {
          const loadedData = {
            name: profileData.name || "",
            age: profileData.age || "",
            gender: profileData.gender || "",
            skin_type: profileData.skin_type || "",
            concern: profileData.concern || "",
            makeup_goal: profileData.makeup_goal || "",
            nutrition_goal: profileData.nutrition_goal || "",
            dietary_restriction: profileData.dietary_restriction || "",
            wellness_focus: profileData.wellness_focus || "",
            dedicate_time: profileData.dedicate_time || "",
            hair_type: profileData.hair_type || "",
            hair_concern: profileData.hair_concern || "",
            style_preference: profileData.style_preference || "",
            styling_goal: profileData.styling_goal || "",
          };
          setFormData(loadedData);
          setInitialFormData(loadedData); // store the original data
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [token]);

  const isFormUnchanged =
    initialFormData !== null &&
    JSON.stringify(formData) === JSON.stringify(initialFormData);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!token) {
      destructiveToast("Please log in to save your profile");
      return;
    }

    setIsLoading(true);
    try {
      const response = await Api.client.updateProfile(formData, token);
      setInitialFormData(formData);
      primaryToast({ description: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      destructiveToast("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
        {/* Header */}
        <SettingsHeader title="Personal Details" />

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {!isAuthenticated && !isLoading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                Please log in to save your profile information.
              </p>
            </div>
          )}

          {isLoadingProfile && (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading profile...</p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              placeholder="Enter your name"
            />
          </div>

          {/* Age Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              placeholder="Enter your age"
              min="1"
              max="120"
            />
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Gender
            </label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleInputChange("gender", value)}
            >
              <SelectTrigger className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectGroup>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">
                    Prefer not to say
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Skin Type
            </label>
            <Select
              value={formData.skin_type}
              onValueChange={(value) => handleInputChange("skin_type", value)}
            >
              <SelectTrigger className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all">
                <SelectValue placeholder="Select Skin Type" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectGroup>
                  <SelectItem value="oily">Oily</SelectItem>
                  <SelectItem value="dry">dry</SelectItem>
                  <SelectItem value="combination">Combination</SelectItem>
                  <SelectItem value="combination-dry">
                    Combination dry
                  </SelectItem>
                  <SelectItem value="combination-oily">
                    Combination oily
                  </SelectItem>
                  <SelectItem value="sensitive">Sensitive</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Skin Concern
            </label>
            <Select
              value={formData.concern}
              onValueChange={(value) => handleInputChange("concern", value)}
            >
              <SelectTrigger className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all">
                <SelectValue placeholder="Select Skin Concern" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectGroup>
                  <SelectItem value="breakouts">Breakouts</SelectItem>
                  <SelectItem value="discoloration">Discoloration</SelectItem>
                  <SelectItem value="redness">Redness</SelectItem>
                  <SelectItem value="aging">Aging</SelectItem>
                  <SelectItem value="dullness">Dullness</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Makeup Goal
            </label>
            <Select
              value={formData.makeup_goal}
              onValueChange={(value) => handleInputChange("makeup_goal", value)}
            >
              <SelectTrigger className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all">
                <SelectValue placeholder="Select makeup goal" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectGroup>
                  <SelectItem value="Natural everyday look">
                    Natural everyday look
                  </SelectItem>
                  <SelectItem value="Full glam/evening looks">
                    Full glam/evening looks
                  </SelectItem>
                  <SelectItem value="Professional/work appropriate">
                    Professional/work appropriate
                  </SelectItem>
                  <SelectItem value="Learn basic techniques">
                    Learn basic techniques
                  </SelectItem>
                  <SelectItem value="Color matching and application">
                    Color matching and application
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Nutrition Goal
            </label>
            <Select
              value={formData.nutrition_goal}
              onValueChange={(value) =>
                handleInputChange("nutrition_goal", value)
              }
            >
              <SelectTrigger className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all">
                <SelectValue placeholder="Select nutrition goal" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectGroup>
                  <SelectItem value="Weight loss">Weight loss</SelectItem>
                  <SelectItem value="Weight gain/muscle building">
                    Weight gain/muscle building
                  </SelectItem>
                  <SelectItem value="Better skin/hair/nail health">
                    Better skin/hair/nail health
                  </SelectItem>
                  <SelectItem value="More energy">More energy</SelectItem>
                  <SelectItem value="General wellness">
                    General wellness
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Dietary Restrictions
            </label>
            <Select
              value={formData.dietary_restriction}
              onValueChange={(value) =>
                handleInputChange("dietary_restriction", value)
              }
            >
              <SelectTrigger className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectGroup>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Vegetarian/Vegan">
                    Vegetarian/Vegan
                  </SelectItem>
                  <SelectItem value="Gluten-free">Gluten-free</SelectItem>
                  <SelectItem value="Keto/Low-carb">Keto/Low-carb</SelectItem>
                  <SelectItem value="Other allergies/intolerances">
                    Other allergies/intolerances
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Wellness Focus
            </label>
            <Select
              value={formData.wellness_focus}
              onValueChange={(value) =>
                handleInputChange("wellness_focus", value)
              }
            >
              <SelectTrigger className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all">
                <SelectValue placeholder="Select wellness focus" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectGroup>
                  <SelectItem value="Stress management">
                    Stress management
                  </SelectItem>
                  <SelectItem value="Better sleep">Better sleep</SelectItem>
                  <SelectItem value="Mental health support">
                    Mental health support
                  </SelectItem>
                  <SelectItem value="Fitness/exercise">
                    Fitness/exercise
                  </SelectItem>
                  <SelectItem value="Building confidence">
                    Building confidence
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Dedicate Time
            </label>
            <Select
              value={formData.dedicate_time}
              onValueChange={(value) =>
                handleInputChange("dedicate_time", value)
              }
            >
              <SelectTrigger className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all">
                <SelectValue placeholder="Select dedicate time" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectGroup>
                  <SelectItem value="5-10 minutes">5-10 minutes</SelectItem>
                  <SelectItem value="15-20 minutes">15-20 minutes</SelectItem>
                  <SelectItem value="30+ minutes">30+ minutes</SelectItem>
                  <SelectItem value="It varies">It varies</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Hair Type
            </label>
            <Select
              value={formData.hair_type}
              onValueChange={(value) => handleInputChange("hair_type", value)}
            >
              <SelectTrigger className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all">
                <SelectValue placeholder="Select Hair Type" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectGroup>
                  <SelectItem value="straight">Straight</SelectItem>
                  <SelectItem value="wavy">Wavy</SelectItem>
                  <SelectItem value="curly">Curly</SelectItem>
                  <SelectItem value="Coily/Kinky">Coily/Kinky</SelectItem>
                  <SelectItem value="not sure">Not Sure</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Hair Concern
            </label>
            <Select
              value={formData.hair_concern}
              onValueChange={(value) =>
                handleInputChange("hair_concern", value)
              }
            >
              <SelectTrigger className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all">
                <SelectValue placeholder="Select hair concern" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectGroup>
                  <SelectItem value="Dryness and damage">
                    Dryness and damage
                  </SelectItem>
                  <SelectItem value="Oily scalp">Oily scalp</SelectItem>
                  <SelectItem value="Hair loss/thinning">
                    Hair loss/thinning
                  </SelectItem>
                  <SelectItem value="Frizz and unmanageability">
                    Frizz and unmanageability
                  </SelectItem>
                  <SelectItem value="Lack of volume">Lack of volume</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Style Preference
            </label>
            <Select
              value={formData.style_preference}
              onValueChange={(value) =>
                handleInputChange("style_preference", value)
              }
            >
              <SelectTrigger className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all">
                <SelectValue placeholder="Select style preference" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectGroup>
                  <SelectItem value="Classic and timeless">
                    Classic and timeless
                  </SelectItem>
                  <SelectItem value="Trendy and fashion-forward">
                    Trendy and fashion-forward
                  </SelectItem>
                  <SelectItem value="Casual and comfortable">
                    {" "}
                    Casual and comfortable
                  </SelectItem>
                  <SelectItem value="Professional and polished">
                    {" "}
                    Professional and polished
                  </SelectItem>
                  <SelectItem value="Still figuring it out">
                    {" "}
                    Still figuring it out
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Styling Goal
            </label>
            <Select
              value={formData.styling_goal}
              onValueChange={(value) =>
                handleInputChange("styling_goal", value)
              }
            >
              <SelectTrigger className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all">
                <SelectValue placeholder="Select styling goal" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectGroup>
                  <SelectItem value="Learn to dress for my body type">
                    Learn to dress for my body type
                  </SelectItem>
                  <SelectItem value="Build a versatile wardrobe">
                    Build a versatile wardrobe
                  </SelectItem>
                  <SelectItem value="Stay trendy on budget">
                    Stay trendy on budget
                  </SelectItem>
                  <SelectItem value="Look put-together with minimal effort">
                    Look put-together with minimal effort
                  </SelectItem>
                  <SelectItem value="Express my personality through style">
                    Express my personality through style
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Save Button */}
        <div className="sticky inset-0 p-6 pt-0">
          <button
            onClick={handleSaveChanges}
            disabled={isLoading || !isAuthenticated || isFormUnchanged}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>
    </ProtectedRoute>
  );
}
