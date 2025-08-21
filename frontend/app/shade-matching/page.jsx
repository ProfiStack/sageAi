"use client";
import ShadeAnalysis from "@/CustomComponents/analysis/ShadeMatching";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";

export default function ShadeMatching() {
  return (
    <>
      <ProtectedRoute requireAuth={true}>
        <ShadeAnalysis />
      </ProtectedRoute>
    </>
  );
}
