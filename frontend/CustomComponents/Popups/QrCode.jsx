"use client";
import React, { useState, useEffect } from "react";
import { X, QrCode, Download, Share2 } from "lucide-react";
import { createPortal } from "react-dom";
import QRCode from "qrcode";

// QR Code Modal Component
export default function QRCodeModal({ isOpen, onClose }) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL("https://sageeai.com/", { width: 300 })
        .then(setQrCodeUrl)
        .catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

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

          {qrCodeUrl && (
            <div className="bg-white p-4 rounded-2xl border-4 border-[#D4B038]/20 inline-block">
              <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body // ✅ ensures modal is rendered outside all layout containers
  );
}
