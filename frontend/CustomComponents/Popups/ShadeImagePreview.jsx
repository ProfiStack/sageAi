"use client";

import { Api } from "@/shared/api/api";
import { useShadeMatchStore, useSkinResultStore } from "@/store/skinResult";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import useFormToast from "../FormToast/FormToast";

export default function ShadePreviewPopup({
  open,
  setOpen,
  image,
  imageFile,
  setPreviewImage,
  onClose,
}) {
  const { destructiveToast } = useFormToast();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleConfirm = async (imageUrlOrFile) => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      if (imageUrlOrFile instanceof File) {
        formData.append("image", imageUrlOrFile, "skin.jpg");
      } else {
        throw new Error("Expected File object, got: " + typeof imageUrlOrFile);
      }

      const apiResponse = await Api.client.analyzeShadeMatching(formData);
      if (apiResponse?.detail?.toLowerCase().includes("no face")) {
        destructiveToast("Face not detected. Please upload a clearer photo.");
        return;
      }

      const { setShadeResult } = useShadeMatchStore.getState();
      setShadeResult(apiResponse.results);
      setPreviewImage(null);
      router.push("/shade-result");
    } catch (err) {
      console.error("Request details:", err.request);
    } finally {
      setIsLoading(false);
    }
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
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
            <div className="flex flex-col items-center">
              <svg
                className="animate-spin h-10 w-10 text-[#D4B038]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <p className="font-medium text-[#02331E]">
                {" "}
                Loading your shades... Please sit tight!
              </p>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 -translate-y-5 left-0 w-full px-4 rounded-2xl z-10 flex justify-between gap-4  ">
          <button
            onClick={handleCancel}
            className="w-1/2 text-center text-[#02331E] bg-white/80  rounded-2xl font-semibold py-2 border-r border-gray-300"
          >
            Cancel Upload
          </button>
          <button
            onClick={() => handleConfirm(imageFile)}
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
