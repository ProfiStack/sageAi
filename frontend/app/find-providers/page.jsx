import dynamic from "next/dynamic";

const ConsultationChat = dynamic(() => import('@/CustomComponents/chat/chat'), {
  ssr: false,
});
export default function FindProviders() {
  return (
    <div>
      <ConsultationChat
        route="find-providers"
        title="Find Providers"
        initialMessage={
          "Finding the right professional matters. I’ll help you explore verified providers for treatments that match your skin, goals, and comfort level."
        }
      />
    </div>
  );
}
