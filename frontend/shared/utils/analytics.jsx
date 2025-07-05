import * as amplitude from '@amplitude/analytics-browser';

// lib/analytics.ts
let isInitialized = false;

export const initAmplitude = () => {
    if (!isInitialized && typeof window !== 'undefined') {
        console.log(process.env.NEXT_PUBLIC_AMPLITUDE)
        amplitude.init("63e107bd2acaf39c72242acde4577f74", {
            autocapture: true, serverZone: 'EU', // ✅ Tell Amplitude to use EU data center
        });
        isInitialized = true;
    }
};

export const logEvent = (eventName, eventProperties) => {
    if (typeof window !== 'undefined' && isInitialized) {
        console.log(eventName, eventProperties);
        amplitude.track(eventName, eventProperties);
    } else {
        console.warn("Amplitude not initialized. Event not sent:", eventName);
    }
};
