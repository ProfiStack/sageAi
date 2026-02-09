"use client";

import ProductCameraPopup from "@/CustomComponents/cameraPopups/ProductAnalysis";
import Footer from "@/CustomComponents/Footer/Footer";
import ImagePreviewPopup from "@/CustomComponents/Popups/ImagePreviewPopup";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import Image from "next/image";
import { useRef, useState } from "react";

export default function ProductAnalysis() {
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
      <SettingsHeader title={"Product Analysis"} />

      <div
        className="flex-1 px-4 flex flex-col"
        style={{ height: "calc(100vh - 142px)" }}
      >
        <div className="flex-shrink-0">
          <p className="text-[28px] font-bold leading-tight mt-[10px]">
            AI-Powered Product Analysis. Accurate. Secure. Trusted.
          </p>
          <p className="text-[#0D171C] mb-4 mt-2">
            Scan any product with AI to uncover ingredients, benefits, and
            potential concerns — all personalized, private, and precise.
          </p>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div
            className="relative rounded-3xl flex-1 mb-4"
            style={{ minHeight: "200px" }}
          >
            <Image
              src="/images/products.png"
              fill
              className="object-cover rounded-3xl"
            />
          </div>

          <div className="flex-shrink-0 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUploadClick}
                className="w-full text-white py-2 rounded-3xl font-medium bg-[#02331E]"
              >
                Upload a clear photo
              </button>
              <button
                onClick={() => SetIsOpen(true)}
                className="w-full text-white py-2 rounded-3xl font-medium bg-[#02331E]"
              >
                Take a photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ProductCameraPopup open={isOpen} setOpen={SetIsOpen} />
      <ImagePreviewPopup
        open={showPreview}
        setOpen={setShowPreview}
        image={previewImage}
      />
    </div>
  );
}
