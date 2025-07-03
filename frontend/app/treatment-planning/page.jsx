import dynamic from "next/dynamic";
import { WebSocketProvider } from "../providers/chatProvider";

const ConsultationChat = dynamic(() => import('@/CustomComponents/chat/chat'), {
  ssr: false,
});
export default function TreatmentPlanning() {
  return (
    <WebSocketProvider route="treatment_planning">
      <ConsultationChat
        route="treatment_planning"
        title="Treatment Planning"
        initialMessage={
          "From lasers to peels, not every treatment fits every skin type. I’ll help you discover options that match your goals and avoid what doesn’t."
        }
      />
    </WebSocketProvider>
  );
}
