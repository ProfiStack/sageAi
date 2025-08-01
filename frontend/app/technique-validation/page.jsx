import dynamic from "next/dynamic";
import { WebSocketProvider } from "../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function MakeupLooks() {
  return (
    <ProtectedRoute requireAuth={true}>
      <WebSocketProvider route="technique_validation">
        <ConsultationChat
          route="technique_validation"
          title="Technique Validation"
          initialMessage={
            "🎨 Welcome to Technique Validation! Share your makeup process or routine, and I’ll guide you with expert tips, corrections, and suggestions to enhance your technique. What would you like me to review today?"
          }
        />
      </WebSocketProvider>
    </ProtectedRoute>
  );
}
