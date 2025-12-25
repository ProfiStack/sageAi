'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import posthog from 'posthog-js';
import PostHogPageView from './postHogPageView';

const PostHogContext = createContext(undefined);

export function PostHogProvider({ children }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || initialized) return;

    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!apiKey) {
      console.error('PostHog API key missing');
      return;
    }

    posthog.init(apiKey, {
      api_host: apiHost,
      capture_pageview: false, // manual page tracking
    });

    setInitialized(true);
  }, [initialized]);

  const logEvent = (eventName, eventProperties) => {
    if (!initialized) return;
    posthog.capture(eventName, eventProperties);
  };

  return (
    <PostHogContext.Provider value={{ logEvent, initialized }}>
      {initialized && <PostHogPageView />}
      {children}
    </PostHogContext.Provider>
  );
}

export function usePostHog() {
  const context = useContext(PostHogContext);
  if (!context) {
    throw new Error('usePostHog must be used within PostHogProvider');
  }
  return context;
}
