"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, X } from "lucide-react";

export default function MoleCameraPopup({ open, setOpen }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [brightnessMessage, setBrightnessMessage] = useState("");
  const [isIdealBrightness, setIsIdealBrightness] = useState(false);

  // Start the camera
  useEffect(() => {
    let brightnessInterval;

    if (open && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setIsReady(true);

            // Start brightness check
            brightnessInterval = setInterval(() => {
              if (!videoRef.current || !canvasRef.current) return;

              const video = videoRef.current;
              const canvas = canvasRef.current;
              const ctx = canvas.getContext("2d");

              const width = video.videoWidth;
              const height = video.videoHeight;

              if (width === 0 || height === 0) return;

              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(video, 0, 0, width, height);

              const imageData = ctx.getImageData(0, 0, width, height);
              const pixels = imageData.data;
              let totalBrightness = 0;
              let count = 0;

              for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                const brightness = (r + g + b) / 3;
                totalBrightness += brightness;
                count++;
              }

              const avgBrightness = totalBrightness / count;

              if (avgBrightness < 120) {
                setBrightnessMessage("Brightness is too low");
                setIsIdealBrightness(false);
              } else if (avgBrightness > 150) {
                setBrightnessMessage("Brightness is too high");
                setIsIdealBrightness(false);
              } else {
                setBrightnessMessage("Perfect Brightness");
                setIsIdealBrightness(true);
              }
            }); // Check every 500ms
          }
        })
        .catch((err) => {
          console.error("Camera error:", err);
          setIsReady(false);
        });
    }

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      clearInterval(brightnessInterval);
    };
  }, [open]);

  const handleCapture = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Set full canvas size (not used for final image)
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    // Draw mirrored video frame to canvas
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -videoWidth, 0, videoWidth, videoHeight);
    ctx.restore();

    // Define crop area in the center (matching Scan icon)
    const cropSize = 160; // Slightly larger than Scan icon for clarity
    const cropX = videoWidth / 2 - cropSize / 2;
    const cropY = videoHeight / 2 - cropSize / 2;

    // Create cropped canvas
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = cropSize;
    croppedCanvas.height = cropSize;
    const croppedCtx = croppedCanvas.getContext("2d");

    // Crop from main canvas
    croppedCtx.drawImage(
      canvas,
      cropX,
      cropY,
      cropSize,
      cropSize,
      0,
      0,
      cropSize,
      cropSize
    );

    // Export image
    const dataUrl = croppedCanvas.toDataURL("image/png");
    setCapturedImage(dataUrl);
  };

  const handleClose = () => {
    setOpen(false);
    setCapturedImage(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative bg-white bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10 rounded-xl overflow-hidden w-[360px] max-w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 z-10"
            >
              <X size={24} />
            </button>

            <h2 className="text-lg text-[#02331E] font-bold mt-4">
              Mole Analysis
            </h2>
            <p className="text-xs text-[#02331E] mb-2">
              Align your Mole in the center and tap the capture button below.
            </p>

            {/* Camera View */}
            <div className="relative w-full h-[500px] bg-black">
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }} // Mirror camera
                    playsInline
                    muted
                    autoPlay
                  />
                  {/* Brightness message */}
                  {brightnessMessage && (
                    <div
                      className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-xl text-sm font-semibold shadow-md
      ${isIdealBrightness ? "bg-white/80 text-[#02331E]" : "bg-black/70 text-red-400"}`}
                    >
                      {brightnessMessage}
                    </div>
                  )}
                  {/* Scan Icon */}
                  <Scan
                    className="absolute"
                    color={isIdealBrightness ? "#22c55e" : "white"}
                    size={80}
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      pointerEvents: "none",
                      opacity: 0.8,
                    }}
                  />
                </>
              ) : (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Capture Button */}
            {!capturedImage && (
              <button
                onClick={handleCapture}
                disabled={!isIdealBrightness}
                className={`absolute bottom-2 h-16 w-16 rounded-full border-[4px] border-gray-300 shadow-lg
      ${
        isIdealBrightness
          ? "bg-gray-100  opacity-100 cursor-pointer"
          : "bg-gray-400 opacity-50 cursor-not-allowed"
      }`}
              />
            )}

            {/* Confirm/Retake Buttons */}
            {capturedImage && (
              <div className="absolute bottom-0 -translate-y-5 left-0 w-full px-4 rounded-2xl z-10 flex justify-between  backdrop-blur-sm">
                <button
                  onClick={handleClose}
                  className="w-1/2 text-center text-[#02331E] bg-white/80  rounded-2xl font-semibold py-2 border-r border-gray-300"
                >
                  Cancel Upload
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="w-1/2 text-center  rounded-2xl text-white font-semibold py-2 bg-[#02331E]"
                >
                  Confirm Upload
                </button>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
