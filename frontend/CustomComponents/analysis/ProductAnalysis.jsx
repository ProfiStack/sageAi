"use client";

import ProductCameraPopup from "@/CustomComponents/cameraPopups/ProductAnalysis";
import Footer from "@/CustomComponents/Footer/Footer";
import ImagePreviewPopup from "@/CustomComponents/Popups/ImagePreviewPopup";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import NextImage from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { Api } from "@/shared/api/api";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
import { Info } from "lucide-react";

export default function ProductAnalysis() {
  const [isOpen, SetIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [file, setFile] = useState(null);
  const barcodeReaderRef = useRef(null);

  // Initialize barcode reader
  useEffect(() => {
    const hints = new Map();

    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.DATA_MATRIX,
      BarcodeFormat.AZTEC,
      BarcodeFormat.PDF_417,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.CODE_93,
      BarcodeFormat.ITF,
      // BarcodeFormat.CODABAR, // ✅ REMOVED - causes false positives on text
    ]);

    hints.set(DecodeHintType.TRY_HARDER, true);
    hints.set(DecodeHintType.PURE_BARCODE, false);

    barcodeReaderRef.current = new BrowserMultiFormatReader(hints);

    return () => {
      barcodeReaderRef.current?.reset();
    };
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
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

  // ✅ Helper to convert Blob to File
  const blobToFile = (blob, filename) => {
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
  };

  // ✅ Helper function to convert blob/file to image element
  const blobToImageElement = (blob) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image"));
      };

      img.src = url;
    });
  };

  // ✅ Helper function to try multiple decoding strategies
  const DecodeBarCode = async (imageBlob) => {
    const img = await blobToImageElement(imageBlob);
    return await barcodeReaderRef.current.decodeFromImageElement(img);
  };

  // Process image and detect barcode
  const processImageWithBarcode = async (imageInput) => {
    // ✅ Validation
    if (!imageInput) {
      console.error("❌ No image input provided!");
      return;
    }

    if (!(imageInput instanceof Blob)) {
      console.error("❌ Image input is not a Blob or File!", imageInput);
      return;
    }

    // ✅ Barcode detection
    let barcodeValue = null;
    let detectedFormat = null;

    try {
      const result = await DecodeBarCode(imageInput);
      barcodeValue = result.getText();
      detectedFormat = result.getBarcodeFormat();
    } catch (err) {
      console.warn("⚠️ Client barcode detection failed:", err.message);
    }

    // ✅ Convert to File for API upload
    let imageFile = imageInput;
    if (imageInput instanceof Blob && !(imageInput instanceof File)) {
      imageFile = blobToFile(imageInput, `product_${Date.now()}.jpg`);
    }

    // Upload to API
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("barcode", barcodeValue || "");
    formData.append(
      "barcodeFormat",
      detectedFormat ? BarcodeFormat[detectedFormat] : "",
    );

    try {
      const res = await Api.client.analyzeProduct(formData);

      console.log(res);
    } catch (error) {
      console.error("❌ API Error:", error);
    }
  };

  // Handle camera capture
  const handleCameraCapture = async (imageBlob) => {
    await processImageWithBarcode(imageBlob);
  };

  // Handle file upload confirm
  const handleUploadConfirm = async (imageFile) => {
    setShowPreview(false);

    await processImageWithBarcode(imageFile);

    // Clean up after processing
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewImage(null);
    setFile(null);

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#fafafa] ">
      <SettingsHeader title={"Product Analysis"} />

      <div
        className="flex-1 px-8 flex flex-col "
        style={{ height: "calc(100vh - 142px)" }}
      >
        <div className="flex-shrink-0">
          <p className="text-[28px] font-bold leading-tight mt-[10px] text-[#02331E]">
            AI-Powered Product
            <br /> Analysis.
            <br /> Accurate. Secure. Trusted.
          </p>
          <p className=" mb-4 mt-2 text-gray-500">
            Scan any product with AI to uncover ingredients, benefits, and
            potential concerns — all personalized, private, and precise.
          </p>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-2xl">
            {/* Image */}
            <NextImage
              src={"/images/productAnalysis.png"}
              alt="Product"
              fill
              className="object-cover"
              priority
            />

            {/* Scan line */}
            <motion.div
              className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-[0_0_15px_#D4B038]"
              animate={{ top: ["10%", "90%", "10%"], opacity: [1, 1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Glow border */}
            <motion.div
              className="absolute inset-4 rounded-3xl border-[3px] border-yellow-400/30"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Corner markers */}
            <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-yellow-400" />
            <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-yellow-400" />
            <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-yellow-400" />
            <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-yellow-400" />
          </div>

          <div className="mt-6 rounded-2xl border border-accent/30 bg-[#D4B038]/20 p-4">
            <div className="flex gap-3">
              <span className="material-symbols-outlined mt-0.5 text-[#02331E]">
                <Info />
              </span>

              <div className="text-sm leading-snug text-[#02331E]">
                <p className="font-bold">For Best Results:</p>
                <p>
                  Ensure the barcode and label text are clearly visible and
                  well-lit.
                </p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 my-4 ">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUploadClick}
                className="w-full text-[#02331E] py-4 rounded-full font-semibold border border-[#02331E] bg-white"
              >
                Upload photo
              </button>
              <button
                onClick={() => SetIsOpen(true)}
                className="w-full text-white py-4 rounded-full font-semibold bg-[#02331E] flex items-center gap-2 justify-center"
              >
                <Camera />
                Scan Product
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
      <ProductCameraPopup
        open={isOpen}
        setOpen={SetIsOpen}
        onCapture={handleCameraCapture}
      />
      <ImagePreviewPopup
        open={showPreview}
        setOpen={setShowPreview}
        image={previewImage}
        imageFile={file}
        setPreviewImage={setPreviewImage}
        onClose={closePreview}
        onConfirm={handleUploadConfirm}
      />
    </div>
  );
}
