"use client";
import React, { useState, useEffect } from "react";
import { X, QrCode, Download, Share2 } from "lucide-react";

// QR Code Modal Component
export default function QRCodeModal({ isOpen, onClose }) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const websiteUrl = "https://sageeai.com/";

  useEffect(() => {
    if (isOpen && websiteUrl) {
      // Generate QR code using QR Server API (free service)
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(websiteUrl)}`;
      setQrCodeUrl(qrUrl);
    }
  }, [isOpen, websiteUrl]);

  const downloadQRCode = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "sageai-qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#02331E] to-[#D4B038] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <QrCode className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-2xl font-bold text-[#02331E] mb-2">
            Scan QR Code
          </h3>
          <p className="text-gray-600 mb-6">
            Scan this code to visit SageeAI on your mobile device
          </p>

          {/* QR Code */}
          <div className="bg-white p-4 rounded-2xl border-4 border-[#D4B038]/20 mb-6 inline-block">
            {qrCodeUrl && (
              <img
                src={qrCodeUrl}
                alt="QR Code for SageeAI"
                className="w-64 h-64"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
