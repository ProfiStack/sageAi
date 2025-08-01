"use client";

import PictureAnalysisPopup from "@/CustomComponents/cameraPopups/PictureAnalysis";
import Footer from "@/CustomComponents/Footer/Footer";
import ImagePreviewPopup from "@/CustomComponents/Popups/ImagePreviewPopup";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import Image from "next/image";
import { useRef, useState } from "react";

export default function ImageAnalysis() {
  const [isOpen, SetIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [capturedImageFromPopup, setCapturedImageFromPopup] = useState(null);

  const handleImageCapture = (imageData) => {
    setCapturedImageFromPopup(imageData);
    console.log("Received from shadematching popup:", imageData);

    // 🔁 Now you can send this to an API
    // sendToSkinAnalysisAPI(imageData) or similar
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setPreviewImage(imgUrl);
      setShowPreview(true);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <SettingsHeader title={"Skin Analysis"} />

      <div
        className="flex-1 px-4 flex flex-col"
        style={{ height: "calc(100vh - 142px)" }}
      >
        <div className="flex-shrink-0">
          <p className="text-[28px] font-bold leading-tight mt-[10px]">
            AI-Powered Shade Match. Accurate. Effortless. Inclusive.
          </p>
          <p className="text-[#0D171C] mb-4 mt-2">
            Find your perfect foundation and concealer shade with advanced AI
            that analyzes your skin tone in real-time—no guesswork, just a
            flawless match.
          </p>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="relative flex-1 mb-4 " style={{ minHeight: "200px" }}>
            <Image
              src="/images/shadeMatching.png"
              fill
              className="object-contain rounded-xl"
            />
          </div>

          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUploadClick}
                className="w-full text-white py-2 rounded-3xl font-semibold bg-[#02331E]"
              >
                Upload a clear selfie
              </button>
              <button
                onClick={() => SetIsOpen(true)}
                className="w-full text-white py-2 rounded-3xl font-semibold bg-[#02331E]"
              >
                Take a clear selfie
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <p className="w-full flex justify-center text-[#4F8096] text-sm my-2">
              Works better without makeup. Best in natural light.
            </p>
          </div>
        </div>
      </div>

      <Footer />
      <PictureAnalysisPopup
        open={isOpen}
        setOpen={SetIsOpen}
        onCapture={handleImageCapture}
      />
      <ImagePreviewPopup
        open={showPreview}
        setOpen={setShowPreview}
        image={previewImage}
      />
    </div>
  );
}
