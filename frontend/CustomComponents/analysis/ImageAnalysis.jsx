"use client";

import PictureAnalysisPopup from "@/CustomComponents/cameraPopups/PictureAnalysis";
import Footer from "@/CustomComponents/Footer/Footer";
import ImagePreviewPopup from "@/CustomComponents/Popups/ImagePreviewPopup";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import { Api } from "@/shared/api/api";
import { useSkinResultStore } from "@/store/skinResult";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Cookies from "js-cookie";
import useFormToast from "../FormToast/FormToast";

export default function SkinAnalysis() {
  const { destructiveToast } = useFormToast();

  const [isOpen, SetIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const authToken = Cookies.get("authToken");
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [file, setFile] = useState(null);
  const [capturedImageFromPopup, setCapturedImageFromPopup] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleImageCapture = async (imageData) => {
    setCapturedImageFromPopup(imageData);
    const byteString = atob(imageData.split(",")[1]);
    const mimeString = imageData.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const formData = new FormData();
    formData.append("image", blob, "skin.jpg");

    try {
      setIsLoading(true);
      const response = await Api.client.analyzeSkinPhoto(formData, authToken);
      if (
        response?.detail?.toLowerCase().includes("insufficient skin visible") ||
        response?.detail?.toLowerCase().includes("no face")
      ) {
        destructiveToast("Please upload a clearer photo.");
        setIsLoading(false);
        SetIsOpen(false);
        return;
      }
      const { setHtml } = useSkinResultStore.getState();
      setHtml(response.results);
      SetIsOpen(false);
      router.push("/analysis-result");
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending image to backend:", error);
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Clean up previous preview URL
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }

      const imgUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(imgUrl);
      setFile(selectedFile);
      setShowPreview(true);
    }

    e.target.value = "";
  };
  const closePreview = () => {
    setShowPreview(false);
    setPreviewImage(null);
    setFile(null);

    // Clean up the object URL
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-between">
      <div>
        <SettingsHeader title={"Skin Analysis"} />

        <div
          className="flex-1 px-4 flex flex-col"
          style={{ height: "calc(100vh - 142px)" }}
        >
          <div className="flex-shrink-0">
            <p className="text-[20px] text-[#02331E] font-bold leading-tight mt-[10px]">
              Get Your Personal Skin Report
            </p>
            <p className="text-[#02331E] mb-2 mt-1 leading-tight">
              Quick, private analysis & simple steps to healthier skin. Photos
              are encrypted, analyzed, and deleted,only you see results
            </p>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div
              className="relative flex-1 mb-4"
              style={{ minHeight: "200px" }}
            >
              <Image
                src="/images/imageanalysis.png"
                fill
                className="object-cover rounded-xl"
              />
            </div>

            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUploadClick}
                  className="w-full text-white py-2 rounded-3xl font-medium bg-[#02331E]"
                >
                  Upload Selfie
                </button>
                <button
                  onClick={() => SetIsOpen(true)}
                  className="w-full text-white py-2 rounded-3xl font-medium bg-[#02331E]"
                >
                  Snap My Skin
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
      </div>
      <div className="sticky inset-0">
        <Footer />
      </div>

      <PictureAnalysisPopup
        loading={isLoading}
        open={isOpen}
        setOpen={SetIsOpen}
        onCapture={handleImageCapture}
      />
      <ImagePreviewPopup
        open={showPreview}
        setOpen={setShowPreview}
        image={previewImage}
        imageFile={file}
        setPreviewImage={setPreviewImage}
        onClose={closePreview}
      />
    </div>
  );
}
