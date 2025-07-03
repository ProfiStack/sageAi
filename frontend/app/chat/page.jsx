"use client";
import dynamic from "next/dynamic";
import { WebSocketProvider } from "../providers/chatProvider";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});

export default function Chat() {
  return (
    <WebSocketProvider route="skincare">
      <ConsultationChat route="skincare" title="Skincare Assistant" />
    </WebSocketProvider>
  );
}
