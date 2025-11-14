"use client";

import { Info, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Api } from "@/shared/api/api";
import SkinTypePopup from "./SkinTypePopup";
import useAuthStore from "@/store/authStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BeautyQuizPopup = ({
  isOpen,
  setIsOpen,
  quizzData,
  skinTypePopup = false,
  title,
}) => {
  const [isOpenSkinType, setIsOpenSkinType] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [allergies, setAllergies] = useState("");
  const [budget, setBudget] = useState("");
  const [openSelects, setOpenSelects] = useState({});

  const { isAuthenticated } = useAuthStore();
  const { token } = useAuthStore();

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
    setOpenSelects((prev) => ({
      ...prev,
      [questionId]: false,
    }));
  };

  const toggleSelect = (questionId) => {
    setOpenSelects((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };
  const showAllergiesField = quizzData.some((q) => q.allergies === true);

  // Save quiz results to localStorage for guest users
  const saveQuizResultsForGuest = (results) => {
    if (typeof window !== "undefined") {
      // Get previous results if any
      const prevResults = JSON.parse(
        localStorage.getItem("sagee_guest_quiz_results") || "{}"
      );

      // Merge current results with previous ones
      const updatedResults = {
        ...prevResults,
        ...results,
        timestamp: Date.now(),
      };

      localStorage.setItem(
        "sagee_guest_quiz_results",
        JSON.stringify(updatedResults)
      );
    }
  };

  // Update profile with quiz results
  const onSubmit = async () => {
    const results = {
      ...selectedAnswers,
      allergies: allergies,
      budget: budget,
      timestamp: new Date().toISOString(),
    };
    if (!isAuthenticated) {
      // Guest user - save to localStorage
      saveQuizResultsForGuest(results);

      try {
        await Api.client.updateProfile(results, token);
        setIsOpen(false);
      } catch (error) {
        console.error("Error updating profile with quiz results:", error);
      }
    } else {
      try {
        await Api.client.updateProfile(results, token);
        setIsOpen(false);
      } catch (error) {
        console.error("Error updating profile with quiz results:", error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#0000000D]">
            <div className="flex flex-col gap-2">
              <h1 className=" font-bold">{title}</h1>
              {skinTypePopup && (
                <div className="flex items-center gap-2 text-gray-500 ">
                  <p className="text-sm ">Not sure about skin type?</p>
                  <button onClick={() => setIsOpenSkinType(true)}>
                    <Info size={20} fill="#d1fae5" color="#059669" />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="space-y-8">
              <div className="flex items-center gap-2 ">
                {/* Dynamic Questions with Select */}
                {quizzData.map((question, qIndex) => (
                  <div
                    key={question.id}
                    className="relative flex flex-1 flex-col"
                  >
                    <label className=" text-sm font-medium mb-1">
                      {question.title}
                    </label>
                    <Select
                      value={selectedAnswers[question.id]}
                      onValueChange={(value) =>
                        handleOptionSelect(question.id, value)
                      }
                    >
                      <SelectTrigger
                        className="rounded-[12px] border border-[#0000001A] bg-[#F3F4F6]"
                        value={selectedAnswers[question.id]}
                        onClick={() => toggleSelect(question.id)}
                      >
                        <SelectValue
                          placeholder={`Select`}
                          value={selectedAnswers[question.id]}
                          options={question.options}
                        />
                      </SelectTrigger>
                      <SelectContent
                        className="rounded-[12px] bg-[#F3F4F6] border border-[#0000001A]"
                        isOpen={openSelects[question.id]}
                        onClose={() =>
                          setOpenSelects((prev) => ({
                            ...prev,
                            [question.id]: false,
                          }))
                        }
                      >
                        {question.options.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id}
                            onSelect={(value) =>
                              handleOptionSelect(question.id, value)
                            }
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              {/* Allergies Input */}
              {showAllergiesField && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Allergies / Avoid
                  </label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g., fragrance, AHAs"
                    className="w-full px-4 py-3 bg-[#F3F4F6] border border-[#0000001A] rounded-2xl  focus:border-gray-400 focus:outline-none text-base"
                  />
                </div>
              )}

              {/* Budget Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Budget</label>
                <div className="flex gap-3">
                  {["$", "$$", "$$$"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setBudget(level)}
                      className={`px-3 py-2 rounded-[8px]  font-medium transition-all ${
                        budget === level
                          ? "bg-[#02331E] text-white"
                          : "bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-4">
            <button
              onClick={onSubmit}
              className="w-full bg-yellow-500 hover:bg-yellow-600 py-4 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <SkinTypePopup isOpen={isOpenSkinType} setIsOpen={setIsOpenSkinType} />
    </div>
  );
};

export default BeautyQuizPopup;
