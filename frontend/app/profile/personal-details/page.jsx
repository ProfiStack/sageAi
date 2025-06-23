'use client'
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import SettingsHeader from '@/CustomComponents/settingsHeader/settingsHeader';

export default function PersonalDetailsPage() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    lifestyleHealth: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    console.log('Personal Details:', formData);
  };

  const handleBack = () => {
    console.log('Going back...');
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <SettingsHeader title="Personal Details" />

      {/* Form Content */}
      <div className="p-6 space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
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
            onChange={(e) => handleInputChange('age', e.target.value)}
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
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled>Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        {/* Location Field */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            placeholder="Enter your location"
          />
        </div>

        {/* Lifestyle & Health Information Field */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Lifestyle & Health Information
          </label>
          <textarea
            value={formData.lifestyleHealth}
            onChange={(e) => handleInputChange('lifestyleHealth', e.target.value)}
            rows={8}
            className="w-full p-4 bg-green-50 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all resize-none"
            placeholder="Tell us about your lifestyle, health conditions, dietary preferences, exercise habits, sleep patterns, or any other relevant information..."
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="p-6 pt-0">
        <button
          onClick={handleSaveChanges}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Save Changes
        </button>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}