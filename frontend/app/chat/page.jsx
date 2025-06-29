"use client";
import ConsultationChat from "@/CustomComponents/chat/chat";
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
