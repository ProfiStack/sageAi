"use client";

export default function ScanConsentModal({ open, type, onAccept, onDecline }) {
  if (!open) return null;

  const isShade = type === "shade";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl animate-slide-up">
        {/* Handle bar */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#02331E]/10 flex items-center justify-center text-3xl">
            {isShade ? "🎨" : "✨"}
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-[22px] font-bold text-[#02331E] text-center leading-snug mb-2">
          {isShade
            ? "Help Us Match You Better"
            : "Help Us Know Your Skin Better"}
        </h2>

        {/* Body */}
        <p className="text-gray-500 text-center text-sm leading-relaxed mb-1">
          {isShade
            ? "Your selfie helps us fine-tune your shade recommendations over time. We'd love to keep it so future matches get even more spot-on."
            : "Saving your scan lets us track your skin's journey and give you more personalised advice every time you return."}
        </p>

        <p className="text-[#02331E]/60 text-center text-xs mb-6">
          Your photo is encrypted, stored securely, and only ever used to improve
          your results. You can delete it anytime from your profile.
        </p>

        {/* Perks */}
        <ul className="space-y-2 mb-6">
          {[
            isShade ? "More accurate shade matches over time" : "Track your skin progress over time",
            "Personalised tips based on your history",
            "Delete your data anytime, instantly",
          ].map((perk) => (
            <li key={perk} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-5 h-5 rounded-full bg-[#02331E]/10 flex items-center justify-center text-[#02331E] text-xs font-bold">
                ✓
              </span>
              {perk}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <button
          onClick={onAccept}
          className="w-full bg-[#02331E] text-white py-4 rounded-full font-semibold mb-3"
        >
          Yes, save my {isShade ? "shade" : "skin"} data
        </button>
        <button
          onClick={onDecline}
          className="w-full text-gray-400 py-2 rounded-full text-sm font-medium"
        >
          No thanks, just give me my results
        </button>
      </div>
    </div>
  );
}
