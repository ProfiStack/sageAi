import dynamic from "next/dynamic";
import { WebSocketProvider } from "../providers/chatProvider";

const ConsultationChat = dynamic(() => import('@/CustomComponents/chat/chat'), {
  ssr: false,
});
export default function TrendAnalysis() {
  return (
    <WebSocketProvider route="trend_analysis">
      <ConsultationChat
        route="trend_analysis"
        title="Trend Analysis"
        initialMessage={
          "Welcome to Trend Analysis.Heard about a product that’s gone viral? Or a skincare trend everyone’s raving about?Let’s find out if it actually works for your skin. I’ll break down the hype based on your skin type, concerns, and what the science says."
        }
      />
    </WebSocketProvider>
  );
}
