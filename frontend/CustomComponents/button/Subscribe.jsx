import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Api } from "@/shared/api/api";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY);

export default function SubscribeButton({ priceId, token }) {
  const [loading, setLoading] = useState(false);
  const handleSubscribe = async () => {
    setLoading(true);

    try {
      // Call your backend to create a subscription checkout session
      const res = await Api.client.subscribePayment({
        token,
        price_id: priceId,
      })
      if (res.checkout_url) {
        await stripePromise;
        // Redirect user to Stripe checkout page
        window.location.href = res.checkout_url;
      } else {
        alert("Failed to get checkout URL");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <button onClick={handleSubscribe} disabled={loading}>
      {loading ? "Redirecting..." : "Subscribe Now"}
    </button>
  );
}
