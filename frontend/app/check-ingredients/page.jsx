import dynamic from "next/dynamic";
import { WebSocketProvider } from "../providers/chatProvider";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function CheckIngredients() {
  return (
    <ProtectedRoute requireAuth={true}>
      <WebSocketProvider route="ingredient_checker">
        <ConsultationChat
          route="ingredient_checker"
          title="Check Ingredients"
          initialMessage={
            "Curious about an ingredient? I’ll tell you exactly how it works, what skin types it suits, and whether it’s right for you."
          }
        />
      </WebSocketProvider>
    </ProtectedRoute>
  );
}
