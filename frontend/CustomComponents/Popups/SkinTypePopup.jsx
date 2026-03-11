import React, { useState } from "react";
import { X, Search } from "lucide-react";

export default function SkinTypePopup({ isOpen, setIsOpen }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ">
      <div className="bg-white rounded-[10px] shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-b-gray-300 sticky inset-0 bg-white">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Not sure about your skin type?
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Test Section */}
        <div className="p-4">
          <div className="bg-green-50 rounded-[10px] p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Try this simple 2-finger test 👆
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              Drag two clean fingers across your cheek or forehead:
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-yellow-500">✨</span>
                <div className="text-gray-700">
                  <p>
                    Slips easily? <strong>→ You likely have Oily Skin</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-blue-500">🧽</span>
                <div className="text-gray-700">
                  <p>
                    Drags slightly, feels normal?{" "}
                    <strong>→ Likely Normal or Combination</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-brown-600">🏜️</span>
                <div className="text-gray-700">
                  <p>
                    Feels like sandpaper? <strong>→ Probably Dry Skin</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skin Type Explained Button */}
          <button className="w-full bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-medium py-3 px-4 rounded-[10px] mb-4 transition-colors flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Skin type explained?
          </button>

          {/* Skin Types List */}
          <div className="space-y-3 py-2 rounded-[10px] bg-green-50">
            {/* Oily Skin */}
            <div className="  pl-3 ">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                💦 Oily Skin
              </h4>
              <p className="text-sm text-gray-600">
                Shiny all over, prone to breakouts, feels slick or greasy
              </p>
            </div>

            {/* Dry Skin */}
            <div className="  pl-3">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                🌬️ Dry Skin
              </h4>
              <p className="text-sm text-gray-600">
                Feels tight, flaky, or rough, easily irritated, needs deeper
                moisture
              </p>
            </div>

            {/* Dry Combination */}
            <div className="  pl-3">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                🧊 Dry Combination
              </h4>
              <p className="text-sm text-gray-600">
                Mostly dry with slightly oily spots, flaky patches with
                occasional shine, hydration-focused care works best
              </p>
            </div>

            {/* Normal Skin */}
            <div className=" b pl-3">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                🌱 Normal Skin
              </h4>
              <p className="text-sm text-gray-600">
                Balanced moisture, smooth, even tone, rare breakouts or dryness
              </p>
            </div>

            {/* Combination (Oily) */}
            <div className="  pl-3">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                🧃 Combination (Oily)
              </h4>
              <p className="text-sm text-gray-600">
                Oily T-zone (forehead/nose/chin), dry or normal cheeks, needs
                balancing care
              </p>
            </div>

            {/* Sensitive Skin */}
            <div className=" pl-3">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                🧸 Sensitive Skin
              </h4>
              <p className="text-sm text-gray-600">
                Easily irritated, reacts to weather or products, prone to
                redness or itchiness
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
