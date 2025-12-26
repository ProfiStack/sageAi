// app/providers.tsx
'use client';

import { Toaster } from "@/components/ui/toaster";
import { PostHogProvider } from "./posthogProvider";
import AuthInitializer from "@/CustomComponents/AuthInitializer";
import AuthChecker from "@/shared/utils/useHydration";

export default function Providers({ children }) {
  return (
    <>
      <PostHogProvider>
        <Toaster />
        <AuthInitializer />
        <AuthChecker>{children}</AuthChecker>
      </PostHogProvider>
    </>
  );
}
