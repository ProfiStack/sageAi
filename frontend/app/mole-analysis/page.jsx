"use client";

import MoleCameraPopup from "@/CustomComponents/cameraPopups/MoleAnalysis";
import Footer from "@/CustomComponents/Footer/Footer";
import ImagePreviewPopup from "@/CustomComponents/Popups/ImagePreviewPopup";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import Image from "next/image";
import { useRef, useState } from "react";

export default function MoleAnalysis() {
  const [isOpen, SetIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

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
      <SettingsHeader title={"Mole Analysis"} />

      <div
        className="flex-1 px-4 flex flex-col"
        style={{ height: "calc(100vh - 142px)" }}
      >
        <div className="flex-shrink-0">
          <p className="text-[28px] font-bold leading-tight mt-[10px]">
            AI-Powered Mole Scan. Personalised. Private. Precise.
          </p>
          <p className="text-[#0D171C] mb-4 mt-2">
            Analyze your mole for potential concerns and receive expert insights
            instantly.
          </p>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div
            className="relative rounded-3xl flex-1 mb-4"
            style={{ minHeight: "200px" }}
          >
            <Image
              src="/images/mole.png"
              fill
              className="object-cover rounded-3xl"
            />
          </div>

          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUploadClick}
                className="w-full text-white py-2 rounded-3xl font-medium bg-[#02331E]"
              >
                Upload a clear selfie
              </button>
              <button
                onClick={() => SetIsOpen(true)}
                className="w-full text-white py-2 rounded-3xl font-medium bg-[#02331E]"
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
              Works best in natural light.
            </p>
          </div>
        </div>
      </div>

      <Footer />
      <MoleCameraPopup open={isOpen} setOpen={SetIsOpen} />
      <ImagePreviewPopup
        open={showPreview}
        setOpen={setShowPreview}
        image={previewImage}
      />
    </div>
  );
}
