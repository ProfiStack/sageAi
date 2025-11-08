"use client";
import React, { useState } from "react";
import {
  Lightbulb,
  Sun,
  Moon,
  CheckCircle,
  X,
  Calendar,
  Droplets,
  ShoppingBag,
  Star,
  Clock,
  Shield,
  Thermometer,
  Snowflake,
  Heart,
  Download,
  Share2,
  RefreshCw,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSkinResultStore } from "@/store/skinResult";

import {
  downloadSkincareReportPDF,
  shareSkincareReportPDF,
} from "../resultPdf";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import { useRouter } from "next/navigation";
import Footer from "@/CustomComponents/Footer/Footer";

export default function ResultsPage() {
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();
  const resultsData = useSkinResultStore((state) => state.html);
  const handleDownloadReport = () => {
    if (resultsData) {
      downloadSkincareReportPDF(resultsData);
    } else {
      alert("No report data available. Please retake the quiz.");
    }
  };

  const handleShareReport = () => {
    if (resultsData) {
      shareSkincareReportPDF(resultsData);
    } else {
      alert("No report data available. Please retake the quiz.");
    }
  };

  const handleSaveRoutine = async () => {
    try {
      const payload = {
        day_routine: resultsData?.day_routine_section || [],
        night_routine: resultsData?.night_routine_section || [],
      };

      const response = await fetch("/api/save-routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleFavorite = async (product) => {
    const isFav = favorites.some((fav) => fav.name === product.name);
    let updatedFavs;

    if (isFav) {
      updatedFavs = favorites.filter((fav) => fav.name !== product.name);
    } else {
      updatedFavs = [...favorites, product];
    }

    setFavorites(updatedFavs);

    // Send updated favorites to backend
    try {
      await fetch("/api/save-favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorites: updatedFavs }),
      });
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D4B038]/10 to-[#02331E]/10">
      <SettingsHeader title={"Result"} />

      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-6">
          <div className="flex flex-col items-center gap-3 mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#02331E] leading-tight">
              Your Skin Analysis Results
            </h1>
          </div>
          <p className="text-[#02331E]/70 text-base sm:text-lg px-4">
            Personalized skincare guidance powered by AI
          </p>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg mb-6 border border-[#D4B038]/20 mx-2">
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-[#02331E] mb-3">
                Your Skin Profile
              </h2>
              <p className="text-[#02331E]/80 leading-relaxed text-sm sm:text-base">
                {resultsData?.user_profile_section}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#02331E]/5 to-[#D4B038]/5 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Lightbulb className="w-5 h-5 text-[#D4B038] mt-1 flex-shrink-0 mx-auto sm:mx-0" />
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-[#02331E] mb-2">
                  Expert Advice
                </h3>
                <p className="text-[#02331E]/80 text-sm leading-relaxed">
                  {resultsData?.advice_section}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs & Content - Shadcn UI */}
        <Tabs defaultValue="routine" className="mx-2 no-scrollbar">
          <TabsList className="flex flex-wrap p-2 h-auto gap-2 bg-transparent justify-start mb-6">
            <TabsTrigger
              value="routine"
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base font-medium bg-white/50 text-[#02331E] hover:bg-[#D4B038]/20 data-[state=active]:bg-[#D4B038] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Clock className="w-4 h-4" />
              <span>Routine</span>
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base font-medium bg-white/50 text-[#02331E] hover:bg-[#D4B038]/20 data-[state=active]:bg-[#D4B038] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger
              value="seasonal"
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base font-medium bg-white/50 text-[#02331E] hover:bg-[#D4B038]/20 data-[state=active]:bg-[#D4B038] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              <span>Seasonal</span>
            </TabsTrigger>
            <TabsTrigger
              value="lifestyle"
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base font-medium bg-white/50 text-[#02331E] hover:bg-[#D4B038]/20 data-[state=active]:bg-[#D4B038] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Heart className="w-4 h-4" />
              <span>Lifestyle</span>
            </TabsTrigger>
            <TabsTrigger
              value="tips"
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base font-medium bg-white/50 text-[#02331E] hover:bg-[#D4B038]/20 data-[state=active]:bg-[#D4B038] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Shield className="w-4 h-4" />
              <span>Do's & Don'ts</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-[#D4B038]/20">
            {/* Daily Routine Tab */}
            <TabsContent
              value="routine"
              className="space-y-6 sm:space-y-8 mt-0"
            >
              <h2 className="text-xl sm:text-[18px] font-bold text-[#02331E] text-center mb-6">
                Your Personalized Skincare Routine
              </h2>

              <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
                {/* Day Routine */}
                <div className="bg-gradient-to-br from-[#D4B038]/10 to-transparent rounded-xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#D4B038] rounded-full flex items-center justify-center">
                      <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#02331E]">
                      Morning Routine
                    </h3>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {resultsData?.day_routine_section.map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-6 h-6 bg-[#D4B038] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs sm:text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-[#02331E] text-sm leading-relaxed">
                          {step.replace(/^Step \d+ - /, "")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Night Routine */}
                <div className="bg-gradient-to-br from-[#02331E]/10 to-transparent rounded-xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#02331E] rounded-full flex items-center justify-center">
                      <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#02331E]">
                      Evening Routine
                    </h3>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {resultsData?.night_routine_section.map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-6 h-6 bg-[#02331E] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs sm:text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-[#02331E] text-sm leading-relaxed">
                          {step.replace(/^Step \d+ - /, "")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleSaveRoutine}
                  className="p-2 rounded-xl font-semibold text-white bg-[#02331E] flex w-full justify-center"
                >
                  Save Routine
                </button>
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="mt-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[#02331E] text-center mb-6 sm:mb-8">
                Recommended Products
              </h2>
              <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
                {resultsData?.products_section.map((product, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-[#D4B038]/20 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                      <div className="flex flex-1 items-center justify-between w-full">
                        <h3 className="font-bold text-[#02331E] text-base sm:text-lg">
                          {product.name}
                        </h3>
                        <Heart
                          onClick={() => handleToggleFavorite(product)}
                          className={`w-5 h-5 cursor-pointer transition-colors ${
                            favorites.some((fav) => fav.name === product.name)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                        />
                      </div>
                      <p className="text-[#D4B038] font-medium text-sm sm:text-base">
                        {product.brand}
                      </p>

                      <div className="text-left sm:text-right">
                        <p className="text-lg sm:text-xl font-bold text-[#02331E]">
                          ${product.price.replace(" USD", "")}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#D4B038] fill-current" />
                          <span className="text-xs sm:text-sm text-[#02331E]/70">
                            Trending
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[#02331E]/80 text-sm mb-3 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="bg-[#D4B038]/10 rounded-xl p-2">
                        <p className="text-xs text-[#02331E] font-medium">
                          Perfect for: {product.perfect_for}
                        </p>
                      </div>
                      <div className="bg-[#02331E]/10 rounded-xl p-2">
                        <p className="text-xs text-[#02331E]">
                          Why it's trending: {product.why_trending}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Do's and Don'ts Tab */}
            <TabsContent value="tips" className="mt-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[#02331E] text-center mb-6 sm:mb-8">
                Essential Do's and Don'ts
              </h2>
              <div className="space-y-6 sm:space-y-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
                {/* Do's */}
                <div className="bg-gradient-to-br from-green-50 to-transparent rounded-xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                    <h3 className="text-lg sm:text-xl font-bold text-[#02331E]">
                      Do's
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {resultsData?.dos_donts_section.dos.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-[#02331E] text-sm sm:text-base">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Don'ts */}
                <div className="bg-gradient-to-br from-red-50 to-transparent rounded-xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <X className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                    <h3 className="text-lg sm:text-xl font-bold text-[#02331E]">
                      Don'ts
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {resultsData?.dos_donts_section.donts.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-[#02331E] text-sm sm:text-base">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Seasonal Care Tab */}
            <TabsContent value="seasonal" className="mt-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[#02331E] text-center mb-6 sm:mb-8">
                Seasonal Skincare Adjustments
              </h2>
              <div className="space-y-6 sm:space-y-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
                {/* Summer */}
                <div className="bg-gradient-to-br from-orange-50 to-transparent rounded-xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#02331E]">
                      Summer Care
                    </h3>
                  </div>
                  <p className="text-[#02331E] leading-relaxed text-sm sm:text-base">
                    {resultsData?.seasonal_switches_section.summer}
                  </p>
                </div>

                {/* Winter */}
                <div className="bg-gradient-to-br from-blue-50 to-transparent rounded-xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <Snowflake className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#02331E]">
                      Winter Care
                    </h3>
                  </div>
                  <p className="text-[#02331E] leading-relaxed text-sm sm:text-base">
                    {resultsData?.seasonal_switches_section.winter}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Lifestyle Tips Tab */}
            <TabsContent value="lifestyle" className="mt-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[#02331E] text-center mb-6 sm:mb-8">
                Lifestyle Adjustments
              </h2>
              <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
                {resultsData?.lifestyle_adjustments_section.map(
                  (tip, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-[#D4B038]/10 to-transparent rounded-xl p-4 sm:p-6 text-center"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D4B038] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <p className="text-[#02331E] font-medium text-sm sm:text-base">
                        {tip}
                      </p>
                    </div>
                  )
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Summary Section */}
        <div className="bg-gradient-to-r from-[#02331E] to-[#02331E]/90 rounded-2xl p-4 sm:p-6 md:p-8 text-white mt-6 mx-2">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
            Key Takeaways
          </h2>
          <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
            {resultsData?.summary_section.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#D4B038] rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <p className="leading-relaxed text-sm sm:text-base">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-8 sm:mt-12 space-y-4 px-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[#02331E]">
            Ready to transform your skin?
          </h3>
          <p className="text-[#02331E]/70 text-sm sm:text-base">
            Start implementing your personalized routine today
          </p>
          {/* Action Buttons - Mobile First */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 px-4">
            <button
              onClick={handleDownloadReport}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#02331E] text-white rounded-xl hover:bg-[#02331E]/90 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
            <button
              onClick={handleShareReport}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#02331E] rounded-xl border border-[#02331E]/20 hover:bg-[#D4B038]/10 transition-colors text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              Share Results
            </button>
            <button
              onClick={() => router.push("/skin-analysis")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#D4B038] text-white rounded-xl hover:bg-[#D4B038]/90 transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Re-analyze
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
