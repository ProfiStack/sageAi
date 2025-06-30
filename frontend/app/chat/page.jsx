"use client";
import dynamic from "next/dynamic";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});

export default function Chat() {
  return (
    <div>
      <ConsultationChat
        route="skincare"
        title="Consultation Chat"
        initialMessage="Hello! I'm your Consultant. I'm here to help with your general health questions. What would you like to discuss today?"
      />
    </div>
  );
}
