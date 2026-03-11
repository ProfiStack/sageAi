"use client";
import React from "react";
export default function ImagePreviewPopup({
  open,
  setOpen,
  image,
  imageFile,
  setPreviewImage,
  onConfirm,
  onClose,
}) {
  const handleConfirm = async () => {
    await onConfirm(imageFile);
  };
  if (!open) return null;

  const handleCancel = () => {
    setOpen(false);
    setPreviewImage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="relative mx-5 max-w-full w-full rounded-2xl  overflow-hidden">
        <div className="absolute bottom-0 -translate-y-5 left-0 w-full px-4 rounded-2xl z-10 flex justify-between gap-4  ">
          <button
            onClick={handleCancel}
            className="w-1/2 text-center text-[#02331E] bg-white/80  rounded-2xl font-semibold py-2 border-r border-gray-300"
          >
            Cancel Upload
          </button>
          <button
            onClick={handleConfirm}
            className="w-1/2 text-center  rounded-2xl text-white font-semibold py-2 bg-[#02331E]"
          >
            Confirm Upload
          </button>
        </div>

        {image && (
          <img
            src={image}
            alt="Uploaded Selfie"
            className="w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
