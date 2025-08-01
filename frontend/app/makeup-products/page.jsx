import dynamic from "next/dynamic";
import { WebSocketProvider } from "../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function MakeupLooks() {
  return (
    <ProtectedRoute requireAuth={true}>
      <WebSocketProvider route="makeup_products">
        <ConsultationChat
          route="makeup_products"
          title="Makeup Products"
          initialMessage={
            "💄 Welcome to Makeup Products Match! I'm here to help you find the best foundations, lipsticks, and more that suit your skin tone, preferences, and routine. What type of products are you looking to match today?"
          }
        />
      </WebSocketProvider>
    </ProtectedRoute>
  );
}
