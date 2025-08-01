import dynamic from "next/dynamic";
import { WebSocketProvider } from "../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function MakeupLooks() {
  return (
    <ProtectedRoute requireAuth={true}>
      <WebSocketProvider route="makeup_looks">
        <ConsultationChat
          route="makeup_looks"
          title="Makeup Looks"
          initialMessage={
            "💄 Welcome to your AI Makeup Studio! Whether you're prepping for a big event or exploring everyday glam, I'm here to recommend stunning makeup looks tailored just for you."
          }
        />
      </WebSocketProvider>
    </ProtectedRoute>
  );
}
