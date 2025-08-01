import dynamic from "next/dynamic";
import { WebSocketProvider } from "../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function MakeupLooks() {
  return (
    <ProtectedRoute requireAuth={true}>
      <WebSocketProvider route="makeup_tools">
        <ConsultationChat
          route="makeup_tools"
          title="Makeup Tools"
          initialMessage={
            "🛠️ Welcome to Makeup Tools Match! Let's find the perfect brushes, blenders, and tools that work best with your makeup routine and skin type. What products or looks do you usually go for?"
          }
        />
      </WebSocketProvider>
    </ProtectedRoute>
  );
}
