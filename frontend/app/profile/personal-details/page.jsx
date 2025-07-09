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

  const { userId, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    skin_type: "",
    concern: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [initialFormData, setInitialFormData] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setIsLoadingProfile(false);
        return;
      }
      try {
        const profileData = await Api.client.getProfile(userId);
        if (profileData) {
          const loadedData = {
            name: profileData.name || "",
            age: profileData.age || "",
            gender: profileData.gender || "",
            skin_type: profileData.skin_type || "",
            concern: profileData.concern || "",
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
  }, [userId]);

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
    if (!userId) {
      destructiveToast("Please log in to save your profile");
      return;
    }

    setIsLoading(true);
    try {
      const response = await Api.client.updateProfile(formData, userId);
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

          {/* Lifestyle & Health Information Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Skin Type
            </label>
            <input
              type="text"
              value={formData.skin_type}
              onChange={(e) => handleInputChange("skin_type", e.target.value)}
              className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              placeholder="Enter your skin type"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Skin Concerns
            </label>
            <input
              type="text"
              value={formData.concern}
              onChange={(e) => handleInputChange("concern", e.target.value)}
              className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              placeholder="Enter your skin concerns"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="p-6 pt-0">
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
