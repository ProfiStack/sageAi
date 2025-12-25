import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Api } from "@/shared/api/api";
import { Camera } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { usePostHog } from "@/app/providers/posthogProvider";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY);

export default function SubscribeButton({ children, route }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const { token, isSubscribed, skinAnalysis, shadeMatching, isFreeScan } =
    useAuthStore();
  // const { logEvent } = usePostHog();

  const handleSubscribe = async () => {
    setLoading(true);
    if (
      (skinAnalysis && route.includes("skin-analysis")) ||
      (shadeMatching && route.includes("shade-matching")) ||
      isFreeScan
    ) {
      router?.push(route);
    } else {
      try {
        // Call your backend to create a subscription checkout session
        const res = await Api.client.subscribePayment({
          token,
          price_id: process.env.NEXT_PUBLIC_PRICE_ID,
          type: route?.split("/")[1],
        });
        // logEvent("Subscription Clicked", {
        //   click_location: route?.toUpperCase(),
        //   click_value: "Essential",
        // });
        if (res.checkout_url) {
          await stripePromise;
          // Redirect user to Stripe checkout page
          window.location.href = res.checkout_url;
        } else {
          setMessage("Please login again.");
        }
      } catch (error) {
        console.error("Subscription error:", error);
        setMessage("Something went wrong. Please try again later..");
      }
      setLoading(false);
    }
  };

  return (
    <button onClick={handleSubscribe} className="w-full">
      {children}
      <p className="text-xs mt-2 text-red-500">{message}</p>
    </button>
  );
}
