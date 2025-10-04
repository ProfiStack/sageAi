"use client";
import SkinAnalysis from "@/CustomComponents/analysis/ImageAnalysis";
import { Api } from "@/shared/api/api";
import { useHasHydrated } from "@/shared/utils/useHydration";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SkinCare() {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const { token, skinAnalysis, isFreeScan } = useAuthStore();

  useEffect(() => {
    if (hydrated && skinAnalysis === false && !isFreeScan) {
      router.push("/home");
    }
  }, [hydrated, skinAnalysis, router]);
  useEffect(() => {
    const getProfile = async () => {
      if (!hydrated || !token) return; // ✅ wait for hydration + token
      try {
        const res = await Api.client.getProfile(token);
        const skinAnalysis = res.payment_types.includes("skin-analysis");
        const shadeMatching = res.payment_types.includes("shade-matching");
        const store = useAuthStore.getState();
        store.setFreeScan(res.free_scan);
        store.setShadeMatching(shadeMatching);
        store.setSkinAnalysis(skinAnalysis);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    getProfile();
  }, [hydrated, token]);

  if (!hydrated) return null; // wait for localStorage hydration

  return skinAnalysis || isFreeScan ? <SkinAnalysis /> : null;
}
