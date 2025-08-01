import dynamic from "next/dynamic";
import { WebSocketProvider } from "../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function Makeup() {
  return (
    <ProtectedRoute requireAuth={true}>
      <WebSocketProvider route="makeup">
        <ConsultationChat
          route="makeup"
          title="Makeup"
          initialMessage={
            "✨ Welcome to your Makeup Studio! I'm here to help you discover your perfect look. What would you like to explore today?"
          }
        />
      </WebSocketProvider>
    </ProtectedRoute>
  );
}
