import dynamic from "next/dynamic";

const ConsultationChat = dynamic(() => import('@/CustomComponents/chat/chat'), {
  ssr: false,
});
export default function TreatmentPlanning() {
  return (
    <div>
      <ConsultationChat route="treatment_plan" title="Treatment Planning" />
    </div>
  );
}
