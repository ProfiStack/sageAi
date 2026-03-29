"use client";
import React, { useState } from "react";
import {
  Lightbulb,
  Palette,
  Sparkles,
  CheckCircle,
  X,
  ShoppingBag,
  Star,
  Crown,
  Shield,
  Heart,
  Download,
  Share2,
  RefreshCw,
  Zap,
  Award,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadMakeupReportPDF, shareMakeupReportPDF } from "../shadePdf";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import { useRouter } from "next/navigation";
import { useShadeMatchStore } from "@/store/skinResult";
import useAuthStore from "@/store/authStore";
import { Api } from "@/shared/api/api";
import ReviewModal from "@/CustomComponents/Popups/ReviewModal";
import { useReviewPrompt } from "@/hooks/useReviewPrompt";

export default function MakeupResultsPage() {
  const router = useRouter();
  const resultsData = useShadeMatchStore((state) => state.shadeResult);
  const [favorites, setFavorites] = useState([]);

  const { token, userId } = useAuthStore();
  const { shouldShow: showReview, dismiss: dismissReview, markSubmitted: reviewSubmitted } =
    useReviewPrompt("shade_matching");

  const handleDownloadReport = () => {
    if (resultsData) {
      downloadMakeupReportPDF(resultsData);
    } else {
      alert("No report data available. Please retake the quiz.");
    }
  };

  const handleShareReport = () => {
    if (resultsData) {
      shareMakeupReportPDF(resultsData);
    } else {
      alert("No report data available. Please retake the quiz.");
    }
  };

  const handleToggleFavorite = async (product) => {
    const isFav = favorites.some((fav) => fav.shade === product.shade);
    let updatedFavs;

    if (isFav) {
      updatedFavs = favorites.filter((fav) => fav.shade !== product.shade);
    } else {
      updatedFavs = [...favorites, product];
    }

    setFavorites(updatedFavs);

    try {
      const payload = {
        user_favourites: {
          products: product,
        },
      };

      const res = await Api.client.favourites(token, payload, userId);
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
              Your Perfect Makeup Match
            </h1>
          </div>
          <p className="text-[#02331E]/70 text-base sm:text-lg px-4">
            Personalized shade recommendations powered by AI
          </p>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg mb-6 border border-[#D4B038]/20 mx-2">
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-[#02331E] mb-3">
                Your Makeup Profile
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
        <Tabs defaultValue="exact-matches" className="mx-2">
          <TabsList className="flex flex-wrap p-2 h-auto gap-2 bg-transparent justify-start mb-2">
            <TabsTrigger
              value="exact-matches"
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base font-medium bg-white/50 text-[#02331E] hover:bg-[#D4B038]/20 data-[state=active]:bg-[#D4B038] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Crown className="w-4 h-4" />
              <span>Perfect Matches</span>
            </TabsTrigger>
            <TabsTrigger
              value="alternatives"
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base font-medium bg-white/50 text-[#02331E] hover:bg-[#D4B038]/20 data-[state=active]:bg-[#D4B038] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Award className="w-4 h-4" />
              <span>Better Options</span>
            </TabsTrigger>
            <TabsTrigger
              value="textures"
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 text-sm sm:text-base font-medium bg-white/50 text-[#02331E] hover:bg-[#D4B038]/20 data-[state=active]:bg-[#D4B038] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Palette className="w-4 h-4" />
              <span>By Finish</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-[#D4B038]/20">
            {/* Exact Brand Matches Tab */}
            <TabsContent
              value="exact-matches"
              className="space-y-6 sm:space-y-8 mt-0"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-[#02331E] text-center mb-6">
                Your Perfect Shade Matches
              </h2>

              <div className="space-y-4 sm:space-y-6">
                {resultsData?.products_section?.exact_brand_shade_matches?.map(
                  (product, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-[#D4B038]/20 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-5 h-5 text-[#D4B038]" />
                            <h3 className="font-bold text-[#02331E] text-base sm:text-lg">
                              {product.product}
                            </h3>
                            <Heart
                              onClick={() => handleToggleFavorite(product)}
                              className={`w-5 h-5 cursor-pointer transition-colors ${
                                favorites.some(
                                  (fav) => fav.shade === product.shade
                                )
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-400 hover:text-red-500"
                              }`}
                            />
                          </div>
                          <p className="text-[#D4B038] font-medium text-sm sm:text-base mb-1">
                            {product.brand}
                          </p>
                          <p className="text-[#02331E] font-semibold">
                            Shade: {product.shade}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="inline-flex items-center gap-1 bg-[#D4B038]/10 text-[#D4B038] px-3 py-1 rounded-full text-xs font-medium">
                            <Sparkles className="w-3 h-3" />
                            {product.finish}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="bg-[#D4B038]/10 rounded-xl p-3">
                          <h4 className="text-sm font-semibold text-[#02331E] mb-1">
                            Undertone Fit
                          </h4>
                          <p className="text-xs text-[#02331E]/80">
                            {product.undertone_fit}
                          </p>
                        </div>
                        <div className="bg-[#02331E]/10 rounded-xl p-3">
                          <h4 className="text-sm font-semibold text-[#02331E] mb-1">
                            Perfect For
                          </h4>
                          <p className="text-xs text-[#02331E]/80">
                            {product.perfect_for}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </TabsContent>

            {/* Matching Textures Tab */}
            <TabsContent value="textures" className="mt-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[#02331E] text-center mb-2 sm:mb-8">
                Products by Finish Type
              </h2>
              <div className="space-y-6 sm:space-y-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
                {resultsData?.products_section?.matching_textures?.map(
                  (category, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-[#D4B038]/10 to-transparent rounded-xl p-4 sm:p-6"
                    >
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#D4B038] rounded-full flex items-center justify-center">
                          <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-[#02331E]">
                            {category.finish_type} Finish
                          </h3>
                          <p className="text-sm text-[#02331E]/70">
                            Best for {category.recommended_for} skin
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {category.products.map((product, productIndex) => (
                          <div
                            key={productIndex}
                            className="flex items-center gap-3"
                          >
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4B038] flex-shrink-0" />
                            <p className="text-[#02331E] text-sm sm:text-base">
                              {product}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </TabsContent>

            {/* Better Alternatives Tab */}
            <TabsContent value="alternatives" className="mt-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[#02331E] text-center mb-6 sm:mb-8">
                Better Than Viral Products
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {resultsData?.products_section?.better_than_viral?.map(
                  (comparison, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-[#D4B038]/20"
                    >
                      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Viral Product */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">
                              Viral Product
                            </span>
                          </div>
                          <h3 className="font-semibold text-[#02331E] mb-2">
                            {comparison.viral_product}
                          </h3>
                        </div>

                        {/* Better Alternative */}
                        <div className="bg-gradient-to-br from-[#D4B038]/10 to-transparent rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Award className="w-4 h-4 text-[#D4B038]" />
                            <span className="text-sm font-medium text-[#D4B038]">
                              Better Choice
                            </span>
                          </div>
                          <h3 className="font-semibold text-[#02331E] mb-2">
                            {comparison.better_alternative}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-[#02331E]/5 rounded-xl">
                        <h4 className="font-semibold text-[#02331E] mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-[#D4B038]" />
                          Why It's Better
                        </h4>
                        <p className="text-[#02331E]/80 text-sm">
                          {comparison.reason}
                        </p>
                      </div>
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
            {resultsData?.summary_section?.map((point, index) => (
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
            Ready to find your perfect match?
          </h3>
          <p className="text-[#02331E]/70 text-sm sm:text-base">
            Start shopping with your personalized recommendations
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
              onClick={() => router.push("/shade-matching")} // Adjust route as needed
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#D4B038] text-white rounded-xl hover:bg-[#D4B038]/90 transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Re-analyze
            </button>
          </div>
        </div>
      </div>

      {showReview && (
        <ReviewModal
          featureTag="shade_matching"
          onClose={dismissReview}
          onSubmitted={reviewSubmitted}
        />
      )}
    </div>
  );
}
