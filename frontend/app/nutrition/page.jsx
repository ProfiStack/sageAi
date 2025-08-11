
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import dynamic from "next/dynamic";
import { WebSocketProvider } from "../providers/chatProvider";
const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});

export default function Nutrition() {
  return (
    <ProtectedRoute requireAuth={true}>
      <WebSocketProvider route="nutrition">
        <ConsultationChat
          route="nutrition"
          title="Nutrition Assistant"
          initialMessage="Hello! I'm your Consultant. I'm here to help with your nutrition questions. What would you like to discuss today?"
        />
      </WebSocketProvider>
    </ProtectedRoute>
  );
}