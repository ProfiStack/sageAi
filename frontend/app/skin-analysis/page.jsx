"use client";
import SkinAnalysis from "@/CustomComponents/analysis/ImageAnalysis";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";

export default function SkinCare() {
  return (
    <>
      <ProtectedRoute requireAuth={true} requireSubscription={true}>
        <SkinAnalysis />
      </ProtectedRoute>
    </>
  );
}
