"use client";

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Select } from "@radix-ui/react-select";
import React, { useEffect, useRef, useState } from "react";

export default function DatePicker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const selectedRef = useRef(null);
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(currentMonth.getFullYear(), i);
    return {
      label: `${monthDate.toLocaleString("default", { month: "long" })} ${currentMonth.getFullYear()}`,
      value: `${currentMonth.getFullYear()}-${String(i + 1).padStart(2, "0")}`,
    };
  });
  useEffect(() => {
    // Auto-scroll to selected button
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }
  }, [selectedDate]);
  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const days = getMonthDays(currentMonth);

  const handleMonthChange = (value) => {
    const [year, month] = value.split("-");
    const newDate = new Date(Number(year), Number(month) - 1);
    setCurrentMonth(newDate);
  };

  return (
    <div className="rounded-t-[38px] -translate-y-8  bg-white">
      <div className=" rounded-3xl p-4 bg-white shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium">Date</h2>
          </div>

          {/* Month Selector */}
          <div>
            <Select
              value={`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="p-3 rounded-3xl text-[#6B6B6B] border border-[#6B6B6B] gap-2 z-10">
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>

              <SelectContent className="rounded-xl bg-white">
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Horizontal Scroll Days */}
        <div
          className="flex overflow-x-auto space-x-3 py-2"
          style={{ scrollbarWidth: "none" }}
        >
          {days.map((day) => {
            const isSelected =
              selectedDate.toDateString() === day.toDateString();

            return (
              <button
                key={day.toDateString()}
                ref={isSelected ? selectedRef : null}
                onClick={() => setSelectedDate(day)}
                className={`min-w-[55px] rounded-2xl px-2 py-3 text-center flex flex-col items-center justify-center transition-all duration-150 ${
                  isSelected
                    ? "bg-yellow-500 text-white font-bold"
                    : "bg-gray-100 text-black"
                }`}
              >
                <span className="text-lg">{day.getDate()}</span>
                <span className="text-sm">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
