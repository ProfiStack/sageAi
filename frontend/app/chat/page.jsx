"use client";
import dynamic from "next/dynamic";

const ConsultationChat = dynamic(() => import('@/CustomComponents/chat/chat'), {
  ssr: false,
});
import BeautyQuizPopup from "@/CustomComponents/quizzPopup/QuizzPopup";
import { useState } from "react";

export default function Chat() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <ConsultationChat route="skincare" title="Consultation Chat" />
      <BeautyQuizPopup isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
