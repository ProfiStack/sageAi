import ComingSoon from "@/CustomComponents/comingSoon/comingSoon";
import Footer from "@/CustomComponents/Footer/Footer";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import dynamic from "next/dynamic";
import { WebSocketProvider } from "../providers/chatProvider";
const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});

export default function Wellness() {
  return (
    <ProtectedRoute requireAuth={true}>
      <WebSocketProvider route="wellness">
        <ConsultationChat
          route="wellness"
          title="Wellness Assistant"
          initialMessage="Hello! I'm your Consultant. I'm here to help with your wellness questions. What would you like to discuss today?"
        />
      </WebSocketProvider>
    </ProtectedRoute>
  );
}