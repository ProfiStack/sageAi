"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import * as amplitude from "@amplitude/analytics-browser";

const AmplitudeContext = createContext(undefined);

export const AmplitudeProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && typeof window !== "undefined") {
      const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE;

      if (!apiKey) {
        console.error("Amplitude API key missing");
        return;
      }

      amplitude.init(apiKey, undefined, {
        serverZone: "EU", // Use 'EU' if your project is in EU region
        defaultTracking: true,
      });
      setInitialized(true);
    }
  }, [initialized]);

  const logEvent = (eventName, eventProperties) => {
    if (initialized) {
      amplitude.track(eventName, eventProperties);
    } else {
      console.warn("Amplitude not initialized yet");
    }
  };

  return (
    <AmplitudeContext.Provider value={{ logEvent, initialized }}>
      {children}
    </AmplitudeContext.Provider>
  );
};

// Custom hook to use amplitude context
export const useAmplitude = () => {
  const context = useContext(AmplitudeContext);
  if (!context) {
    throw new Error("useAmplitude must be used within AmplitudeProvider");
  }
  return context;
};
