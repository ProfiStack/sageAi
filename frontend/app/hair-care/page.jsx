import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import dynamic from "next/dynamic";
import { WebSocketProvider } from "../providers/chatProvider";
const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});


export default function HairCare() {
  return (
    <ProtectedRoute requireAuth={true}>
      <WebSocketProvider route="hair_care">
        <ConsultationChat
          route="hair_care"
          title="HairCare Assistant"
          initialMessage="Hello! I'm your Consultant. I'm here to help with your Hair care questions. What would you like to discuss today?"
        />
      </WebSocketProvider>
    </ProtectedRoute>
  );
}