"use client";

import { beautyQuizData } from "@/mockData/quizzMockData";
import { X } from "lucide-react";
import { useState } from "react";

const BeautyQuizPopup = ({ isOpen, setIsOpen }) => {
  const [quizData, setQuizData] = useState(beautyQuizData);

  const updateSelection = (questionId, optionId) => {
    setQuizData((prev) =>
      prev.map((question) => {
        if (question.id === questionId) {
          const isMultiple = question.type === "multiple-choice";
          let newSelectedOptions;

          if (isMultiple) {
            // Toggle for multiple choice
            if (question.selectedOptions.includes(optionId)) {
              newSelectedOptions = question.selectedOptions.filter(
                (id) => id !== optionId
              );
            } else {
              newSelectedOptions = [...question.selectedOptions, optionId];
            }
          } else {
            // Single choice - replace selection
            newSelectedOptions = [optionId];
          }

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

  const handleSubmit = () => {
    const answers = {};
    quizData.forEach((question) => {
      answers[question.id] = question.selectedOptions;
    });
    console.log("Quiz Results:", answers);
    alert("Quiz submitted! Check console for results.");
    setIsOpen(false);
  };

  return (
    <div>
      {/* Popup Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Skin Analysis
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Complete {getCompletionCount()}/{quizData.length} sections
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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

                      {/* Selection indicator for multiple choice */}
                      {question.type === "multiple-choice" &&
                        question.selectedOptions.length > 0 && (
                          <p className="text-xs text-emerald-600 mt-2">
                            {question.selectedOptions.length} selected
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {getCompletionCount() === quizData.length
                    ? "Ready to submit."
                    : `${quizData.length - getCompletionCount()} sections remaining`}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={getCompletionCount() !== quizData.length}
                    className={`px-6 py-2 rounded-[8px] font-medium transition-all ${
                      getCompletionCount() > 0
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Submit Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeautyQuizPopup;
