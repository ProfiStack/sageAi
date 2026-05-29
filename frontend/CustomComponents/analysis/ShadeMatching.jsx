"use client";

import PictureAnalysisPopup from "@/CustomComponents/cameraPopups/PictureAnalysis";
import Footer from "@/CustomComponents/Footer/Footer";
import ScanConsentModal from "@/CustomComponents/Popups/ScanConsentModal";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import { Api } from "@/shared/api/api";
import { useShadeMatchStore } from "@/store/skinResult";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Cookies from "js-cookie";
import useFormToast from "../FormToast/FormToast";
import ImagePreviewPopup from "../Popups/ImagePreviewPopup";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";

export default function ShadeAnalysis() {
  const { destructiveToast } = useFormToast();

  const [isOpen, SetIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const authToken = Cookies.get("authToken");
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [pendingUpload, setPendingUpload] = useState(null);
  const router = useRouter();

  const handleUploadImage = async (fileOrBlob, consent = false) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("image", fileOrBlob, "skin.jpg");
      formData.append("consent", consent ? "true" : "false");

      const response = await Api.client.analyzeShadeMatching(
        formData,
        authToken,
      );

      if (
        response?.detail?.toLowerCase().includes("insufficient skin") ||
        response?.detail?.toLowerCase().includes("no face")
      ) {
        destructiveToast("Please upload a clearer photo.");
        return;
      }

      const { setShadeResult } = useShadeMatchStore.getState();
      setShadeResult(response.results);

      router.push("/shade-result");
    } catch (err) {
      console.error("Shade analysis failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageCapture = async (imageData) => {
    SetIsOpen(false);

    const byteString = atob(imageData.split(",")[1]);
    const mimeString = imageData.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    setPendingUpload(blob);
    setShowConsent(true);
  };

  const handleConfirm = async (file) => {
    setShowPreview(false);
    setPreviewImage(null);
    setPendingUpload(file);
    setShowConsent(true);
  };

  const handleConsentResponse = async (consent) => {
    setShowConsent(false);
    if (pendingUpload) {
      await handleUploadImage(pendingUpload, consent);
      setPendingUpload(null);
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
    <div className="h-screen flex flex-col justify-between bg-[#fafafa]">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
          <div className="flex flex-col items-center">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width={60}
              height={60}
            >
              <defs>
                <linearGradient
                  id="greenYellowGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stop-color="#D4B038" />
                  <stop offset="50%" stop-color="#D4B038" />
                  <stop offset="50%" stop-color="#02331E" />
                  <stop offset="100%" stop-color="#02331E" />
                </linearGradient>
              </defs>

              <path
                fill="url(#greenYellowGradient)"
                d="M20.27,4.74a4.93,4.93,0,0,1,1.52,4.61,5.32,5.32,0,0,1-4.1,4.51,5.12,5.12,0,0,1-5.2-1.5,5.53,5.53,0,0,0,6.13-1.48A5.66,5.66,0,0,0,20.27,4.74ZM12.32,11.53a5.49,5.49,0,0,0-1.47-6.2A5.57,5.57,0,0,0,4.71,3.72,5.17,5.17,0,0,1,9.53,2.2,5.52,5.52,0,0,1,13.9,6.45,5.28,5.28,0,0,1,12.32,11.53ZM19.2,20.29a4.92,4.92,0,0,1-4.72,1.49,5.32,5.32,0,0,1-4.34-4.05A5.2,5.2,0,0,1,11.6,12.5a5.6,5.6,0,0,0,1.51,6.13A5.63,5.63,0,0,0,19.2,20.29ZM3.79,19.38A5.18,5.18,0,0,1,2.32,14a5.3,5.3,0,0,1,4.59-4,5,5,0,0,1,4.58,1.61,5.55,5.55,0,0,0-6.32,1.69A5.46,5.46,0,0,0,3.79,19.38ZM12.23,12a5.11,5.11,0,0,0,3.66-5,5.75,5.75,0,0,0-3.18-6,5,5,0,0,1,4.42,2.3,5.21,5.21,0,0,1,.24,5.92A5.4,5.4,0,0,1,12.23,12ZM11.76,12a5.18,5.18,0,0,0-3.68,5.09,5.58,5.58,0,0,0,3.19,5.79c-1,.35-2.9-.46-4-1.68A5.51,5.51,0,0,1,11.76,12ZM23,12.63a5.07,5.07,0,0,1-2.35,4.52,5.23,5.23,0,0,1-5.91.2,5.24,5.24,0,0,1-2.67-4.77,5.51,5.51,0,0,0,5.45,3.33A5.52,5.52,0,0,0,23,12.63ZM1,11.23a5,5,0,0,1,2.49-4.5,5.23,5.23,0,0,1,5.81-.06,5.3,5.3,0,0,1,2.61,4.74A5.56,5.56,0,0,0,6.56,8.06,5.71,5.71,0,0,0,1,11.23Z"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  dur="1.5s"
                  values="0 12 12;360 12 12"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
            <p className="font-medium text-[#02331E]">
              {" "}
              Loading your analysis... Please sit tight!
            </p>
          </div>
        </div>
      )}
      <div>
        <SettingsHeader title={"Shade Matching"} />

        <div
          className="flex-1 px-4 flex flex-col"
          style={{ height: "calc(100vh - 142px)" }}
        >
          <div className="flex-shrink-0">
            <p className="text-[28px] font-bold leading-tight mt-[10px] text-[#02331E]">
              Your Perfect Shade, Every Time
            </p>
            <p className="text-gray-500 mb-4 mt-2">
              No more trial & error, your perfect match in seconds. Photos are
              encrypted, analyzed, and deleted,only you see results
            </p>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="relative w-full max-w-[430px] mx-auto aspect-[4/5] rounded-[32px] overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-2xl z-0">
              {/* Image */}
              <Image
                src={"/images/shadeMatching.png"}
                fill
                alt="Professional portrait for skin analysis"
                className="w-full h-full object-cover grayscale-[20%]"
              />

              {/* T-Zone Overlay */}
              <div
                className="absolute top-[6%] left-1/2 -translate-x-1/2 w-[70%] h-[60%] 
                      border-2 border-yellow-500 rounded-[40px] 
                      shadow-[0_0_20px_rgba(212,176,56,0.4),inset_0_0_15px_rgba(212,176,56,0.3)] 
                      pointer-events-none
                      clip-[polygon(0%_0%,100%_0%,100%_30%,65%_30%,65%_100%,35%_100%,35%_30%,0%_30%)]"
              ></div>

              {/* Scanning Line */}
              <motion.div
                className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent"
                animate={{ top: ["4%", "67%", "4%"], opacity: [1, 1, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="flex-shrink-0 mt-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUploadClick}
                  className="w-full text-[#02331E] py-4 rounded-full font-semibold bg-white border border-[#02331E]"
                >
                  Upload Selfie
                </button>
                <button
                  onClick={() => SetIsOpen(true)}
                  className="w-full text-white py-4 rounded-full font-semibold bg-[#02331E] flex items-center justify-center gap-2"
                >
                  <Camera />
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
        onConfirm={handleConfirm}
      />
      <ScanConsentModal
        open={showConsent}
        type="shade"
        onAccept={() => handleConsentResponse(true)}
        onDecline={() => handleConsentResponse(false)}
      />
    </div>
  );
}
