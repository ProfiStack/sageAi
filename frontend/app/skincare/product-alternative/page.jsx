"use client";
import dynamic from "next/dynamic";
import { WebSocketProvider } from "../../providers/chatProvider";

const ConsultationChat = dynamic(() => import("@/CustomComponents/chat/chat"), {
  ssr: false,
});
export default function ProductAlternative() {
  return (
    <>
      <WebSocketProvider route="product_alternative">
        <ConsultationChat
          route="product_alternative"
          title="Product Alternative"
          initialMessage={
            "Looking for alternatives? Just share the product or ingredient you want alternative of, and I'll suggest similar or better options tailored to your skin."
          }
        />
      </WebSocketProvider>
    </>
  );
}
