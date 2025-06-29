import dynamic from "next/dynamic";

const ConsultationChat = dynamic(() => import('@/CustomComponents/chat/chat'), {
  ssr: false,
});
export default function FindProviders() {
  return (
    <div>
      <ConsultationChat route="find-providers" title="Find Providers" />
    </div>
  );
}
