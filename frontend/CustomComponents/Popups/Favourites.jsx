"use client";
import { X, Star, DollarSign, Sparkles, Info } from "lucide-react";

const FavouritesPopup = ({ isOpen, onClose, favourite }) => {
  if (!isOpen || !favourite) return null;

  const product = favourite?.user_favourites?.products;

  // Check if it's a makeup product (has shade) or skincare (has name)
  const isMakeup = product?.shade !== undefined;
  const isSkincare = product?.name !== undefined;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative bg-[#02331E] p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 fill-white" />
            </div>
            <div>
              <p className="text-white text-sm mb-1">{product?.brand}</p>
              <h2 className="text-xl font-bold">
                {isMakeup ? product?.product : product?.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
          {/* Makeup specific fields */}
          {isMakeup && (
            <>
              {product?.shade && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-pink-600" />
                    <p className="font-semibold text-gray-900 text-sm">Shade</p>
                  </div>
                  <p className="text-gray-700 text-xl font-bold">
                    {product.shade}
                  </p>
                </div>
              )}

              {product?.undertone_fit && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <p className="font-semibold text-gray-900 text-sm mb-2">
                    Undertone Fit
                  </p>
                  <p className="text-gray-700 text-sm">
                    {product.undertone_fit}
                  </p>
                </div>
              )}

              {product?.finish && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="font-semibold text-gray-900 text-sm mb-2">
                    Finish
                  </p>
                  <p className="text-gray-700 text-sm">{product.finish}</p>
                </div>
              )}
            </>
          )}

          {/* Skincare specific fields */}
          {isSkincare && (
            <>
              {product?.description && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="font-semibold text-gray-900 text-sm mb-2">
                    Description
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {product?.why_trending && (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <p className="font-semibold text-gray-900 text-sm">
                      Why It's Trending
                    </p>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {product.why_trending}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Common field - Perfect For */}
          {product?.perfect_for && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-emerald-600" />
                <p className="font-semibold text-gray-900 text-sm">
                  Perfect For
                </p>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {product.perfect_for}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Added on{" "}
              {new Date(favourite.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-[#02331E] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default FavouritesPopup;
