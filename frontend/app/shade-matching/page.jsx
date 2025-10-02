"use client";
import ShadeAnalysis from "@/CustomComponents/analysis/ShadeMatching";
import { Api } from "@/shared/api/api";
import { useHasHydrated } from "@/shared/utils/useHydration";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ShadeMatching() {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const { token, shadeMatching, isFreeScan } = useAuthStore();

  useEffect(() => {
    if (hydrated && shadeMatching === false && !isFreeScan) {
      router.push("/home");
    }
  }, [hydrated, shadeMatching, router]);
  useEffect(() => {
    const getProfile = async () => {
      if (!hydrated || !token) return; // ✅ wait for hydration + token
      const res = await Api.client.getProfile(token);
      const skinAnalysis = res.payment_types.includes("skin-analysis");
      const shadeMatching = res.payment_types.includes("shade-matching");
      const store = useAuthStore.getState();
      store.setFreeScan(res.free_scan);
      store.setShadeMatching(shadeMatching);
      store.setSkinAnalysis(skinAnalysis);
    };
    getProfile();
  }, [hydrated, token]);

  if (!hydrated) return null; // wait for localStorage hydration
  return shadeMatching || isFreeScan ? <ShadeAnalysis /> : null;
}
