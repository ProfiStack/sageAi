"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, X } from "lucide-react";

export default function ProductCameraPopup({ open, setOpen }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    let stream;

    if (open && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: { exact: "environment" } } }) // back camera
        .then((_stream) => {
          stream = _stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.error("Camera error:", err);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [open]);

  const handleCapture = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/png");
    setCapturedImage(dataUrl);
    console.log("📸 Full product image:", dataUrl);
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
              Product Scan
            </h2>
            <p className="text-xs text-[#02331E] mb-2">
              Place your product in the center and tap the button below.
            </p>

            <div className="relative w-full h-[500px] bg-black">
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                    autoPlay
                  />
                  {/* Full-screen scan overlay */}
                  <Scan
                    className="absolute inset-0 w-full h-full text-white opacity-20 pointer-events-none"
                    strokeWidth={1}
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
                className="absolute bottom-2 h-16 w-16 rounded-full bg-[#02331E] border-[6px] border-white shadow-lg"
              />
            )}

            {/* Confirm/Cancel */}
            {capturedImage && (
              <div className="absolute bottom-0 -translate-y-5 left-0 w-full px-4 rounded-2xl z-10 flex justify-between backdrop-blur-sm">
                <button
                  onClick={handleClose}
                  className="w-1/2 text-center text-[#02331E] bg-white/80 rounded-2xl font-semibold py-2 border-r border-gray-300"
                >
                  Cancel Upload
                </button>
                <button
                  onClick={() => {
                    console.log("Send to backend:", capturedImage);
                    setOpen(false);
                  }}
                  className="w-1/2 text-center rounded-2xl text-white font-semibold py-2 bg-[#02331E]"
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
