"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import posthog from "posthog-js";
import PostHogPageView from "./posthogPageView";

const PostHogContext = createContext(undefined);

export const PostHogProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && typeof window !== "undefined") {
      const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

      if (!apiKey) {
        console.error("PostHog API key missing");
        return;
      }

      posthog.init(apiKey, {
        api_host: apiHost,
        capture_pageview: false,
      });

      setInitialized(true);
    }
  }, [initialized]);

  const logEvent = (eventName, eventProperties) => {
    if (initialized) {
      posthog.capture(eventName, eventProperties);
    } else {
      console.warn("PostHog not initialized yet");
    }
  };

  return (
    <PostHogContext.Provider value={{ logEvent, initialized }}>
      <PostHogPageView />
      {children}
    </PostHogContext.Provider>
  );
};

export const usePostHog = () => {
  const context = useContext(PostHogContext);
  if (!context) {
    throw new Error("usePostHog must be used within PostHogProvider");
  }
  return context;
};
