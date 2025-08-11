import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import dynamic from "next/dynamic";
import { WebSocketProvider } from "../providers/chatProvider";
const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});

export default function Styling() {
  return (
    <ProtectedRoute requireAuth={true}>
      <WebSocketProvider route="styling">
        <ConsultationChat
          route="styling"
          title="Styling Assistant"
          initialMessage="Hello! I'm your Consultant. I'm here to help with your styling questions. What would you like to discuss today?"
        />
      </WebSocketProvider>
    </ProtectedRoute>
  );
}
