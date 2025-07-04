"use client";
import dynamic from "next/dynamic";
import { WebSocketProvider } from "../providers/chatProvider";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});

export default function Chat() {
  return (
    <WebSocketProvider route="skincare">
      <ConsultationChat route="skincare" title="Skincare Assistant" initialMessage="Hello! I'm your Consultant. I'm here to help with your skin care questions. What would you like to discuss today?" />
    </WebSocketProvider>
  );
}
