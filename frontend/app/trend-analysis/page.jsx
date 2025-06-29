import dynamic from "next/dynamic";

const ConsultationChat = dynamic(() => import('@/CustomComponents/chat/chat'), {
  ssr: false,
});
export default function TrendAnalysis() {
  return (
    <div>
      <ConsultationChat route="trend_analysis" title="Trend Analysis" />
    </div>
  );
}
