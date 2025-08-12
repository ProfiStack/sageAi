"use client";

import { Info, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Api } from "@/shared/api/api";
import SkinTypePopup from "./SkinTypePopup";
import useAuthStore from "@/store/authStore";

const BeautyQuizPopup = ({
  isOpen,
  setIsOpen,
  onComplete,
  quizzData,
  skinTypePopup = false,
}) => {
  const [isOpenSkinType, setIsOpenSkinType] = useState(false);

  const [quizData, setQuizData] = useState(quizzData);
  const { token } = useAuthStore();
  const hasCompletedRef = useRef(false);

  const updateSelection = (questionId, optionId) => {
    setQuizData((prev) =>
      prev.map((question) => {
        if (question.id === questionId) {
          // Single choice - replace selection
          const newSelectedOptions = [optionId];
          return { ...question, selectedOptions: newSelectedOptions };
        }
        return question;
      })
    );
  };

  const isOptionSelected = (questionId, optionId) => {
    const question = quizData.find((q) => q.id === questionId);
    return question?.selectedOptions.includes(optionId) || false;
  };

  const getCompletionCount = () => {
    return quizData.filter((question) => question.selectedOptions.length > 0)
      .length;
  };

  // Extract skin type and concerns from quiz responses
  const extractQuizResults = () => {
    const results = {};
    quizData.forEach((question) => {
      if (question.selectedOptions.length > 0) {
        // If multiple options allowed, join them with commas
        results[question.id] =
          question.selectedOptions.length > 1
            ? question.selectedOptions.join(", ")
            : question.selectedOptions[0];
      }
    });
    return results;
  };

  // Reset completion flag when popup opens
  useEffect(() => {
    if (isOpen) {
      hasCompletedRef.current = false;
    }
  }, [isOpen]);

  // Auto-submit when both questions are answered
  useEffect(() => {
    if (getCompletionCount() === quizData.length && !hasCompletedRef.current) {
      // Update profile with quiz results
      const updateProfileWithQuizResults = async () => {
        const results = extractQuizResults();

        // Logged in user - update profile via API
        try {
          await Api.client.updateProfile(results, token);
        } catch (error) {
          console.error("Error updating profile with quiz results:", error);
        }

        // Call onComplete callback with results
        if (onComplete) {
          onComplete(results);
        }

        // Mark as completed to prevent multiple executions
        hasCompletedRef.current = true;

        // Close the popup after successful save/update
        setTimeout(() => {
          setIsOpen(false);
        }, 1000);
      };

      updateProfileWithQuizResults();
    }
  }, [quizData, token, setIsOpen, onComplete]);

  return (
    <div>
      {/* Popup Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Skin Analysis
                </h2>
                {skinTypePopup && (
                  <div className="flex items-center gap-2 text-gray-500 ">
                    <p>Not sure about skin type?</p>
                    <button onClick={() => setIsOpenSkinType(true)}>
                      <Info size={20} fill="#d1fae5" color="#059669" />
                    </button>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Complete {getCompletionCount()}/{quizData.length} sections
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="pt-1 hover:bg-gray-100 rounded-full transition-colors flex justify-start items-start"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 pt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(getCompletionCount() / quizData.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-8">
              {quizData.map((question, index) => (
                <div key={question.id} className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-emerald-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {question.title}
                      </h3>

                      {/* Options Pills */}
                      <div className="flex flex-wrap gap-2">
                        {question.options.map((option) => {
                          const isSelected = isOptionSelected(
                            question.id,
                            option.id
                          );
                          return (
                            <button
                              key={option.id}
                              onClick={() =>
                                updateSelection(question.id, option.id)
                              }
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                                isSelected
                                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer - Auto-submit status */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-center">
                <p className="text-sm text-gray-500">
                  {getCompletionCount() === quizData.length
                    ? "Analyzing your responses..."
                    : `${quizData.length - getCompletionCount()} sections remaining`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <SkinTypePopup isOpen={isOpenSkinType} setIsOpen={setIsOpenSkinType} />
    </div>
  );
};

export default BeautyQuizPopup;
