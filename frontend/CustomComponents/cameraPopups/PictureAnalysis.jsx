"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import CameraPermissionModal from "../Popups/CameraPermission";
import { AnimatePresence, motion } from "framer-motion";
import useFormToast from "../FormToast/FormToast";

export default function PictureAnalysisPopup({
  open,
  setOpen,
  onCapture,
  loading,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const { destructiveToast } = useFormToast();

  // ✅ Start camera
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        if (cancelled) return;

        streamRef.current = stream;
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraReady(true);
        };
      } catch (err) {
        console.error(err);
        if (err.name === "NotAllowedError") {
          setCameraPermission(true);
        } else if (err.name === "NotFoundError") {
          destructiveToast("No camera found on this device.");
          setOpen(false);
        } else {
          setOpen(false);
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [open]);

  // ✅ Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  };

  // ✅ Close popup
  const handleClose = () => {
    stopCamera();
    setOpen(false);
  };

  // ✅ Capture photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    // Mirror horizontally
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const image = canvas.toDataURL("image/png");
    stopCamera();
    onCapture(image);
  };

  if (!open) return null;

  return loading ? (
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
          Almost there,we’ll have your personalised tips in a sec
        </p>
      </div>
    </div>
  ) : (
    <AnimatePresence className="relative">
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative bg-white bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10 shadow-lg rounded-xl flex flex-col items-center px-6"
            style={{ width: "350px", minHeight: "530px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mt-8">
              Skin Analysis
            </h2>
            <p className="text-sm text-gray-500 text-center mt-2 mb-4">
              Ensure your face is well-lit
            </p>

            {/* 📸 Camera Container */}
            <div
              className="relative bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
              style={{ width: "350px", height: "430px" }}
            >
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`absolute w-full h-full object-cover transition-opacity duration-300 ${
                  cameraReady ? "opacity-100" : "opacity-0"
                }`}
                style={{ transform: "scaleX(-1)" }} // 👈 mirror video
              />

              {!cameraReady && (
                <div className="absolute text-gray-600 text-sm">
                  Starting camera…
                </div>
              )}

              {/* Capture-only canvas */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <button
              onClick={capturePhoto}
              disabled={!cameraReady}
              className={`absolute bottom-2 mt-4 p-6 rounded-full  font-semibold transition
    ${
      cameraReady
        ? "bg-[#02331E] text-white hover:opacity-90"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
            >
              <Camera />
            </button>
          </motion.div>
        </motion.div>
      )}

      <CameraPermissionModal
        isOpen={cameraPermission}
        setIsOpen={setCameraPermission}
      />
    </AnimatePresence>
  );
}
