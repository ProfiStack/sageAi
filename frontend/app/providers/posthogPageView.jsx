"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import posthog from "posthog-js";

export default function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!posthog.__loaded) return;

    posthog.capture("$pageview", {
      $current_url: `${pathname}?${searchParams.toString()}`,
    });
  }, [pathname, searchParams]);

  return null;
}
