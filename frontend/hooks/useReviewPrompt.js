"use client";
import { useState, useEffect } from "react";
import { Api } from "@/shared/api/api";
import useAuthStore from "@/store/authStore";

// How long to wait after the page loads before showing the modal (ms)
const TRIGGER_DELAY_MS = 30000; // 30 seconds

// Session-level cache key so we don't hit the API again on re-renders
// within the same browser tab. The backend is the true source of truth;
// this just avoids redundant requests.
const SESSION_KEY = "sagee_review_session";

/**
 * useReviewPrompt
 *
 * Asks the backend whether to show the review modal for a given feature.
 * Cooldown rules (e.g. skin_analysis = always, shade_matching = 20 days)
 * are enforced entirely server-side.
 *
 * @param {string} featureTag  — skin_analysis | shade_matching | recommendation | general
 * @returns {{ shouldShow: boolean, dismiss: () => void, markSubmitted: () => void }}
 */
export function useReviewPrompt(featureTag) {
  const { token } = useAuthStore();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !token || !featureTag) return;

    // Check session cache first — avoids an API call on every render
    const sessionCache = _readSession();
    if (sessionCache[featureTag] === false) return; // already decided "no" this session

    let timer;

    Api.client.getReviewPromptStatus(token, featureTag)
      .then((res) => {
        if (!res?.should_prompt) {
          _writeSession(featureTag, false);
          return;
        }
        // Backend says prompt — schedule the modal after the delay
        timer = setTimeout(() => setShouldShow(true), TRIGGER_DELAY_MS);
      })
      .catch(() => {
        // If the API fails, silently skip — never block the UI
      });

    return () => clearTimeout(timer);
  }, [featureTag, token]);

  /** User clicked "Maybe Later" — hide modal, backend handles skip cooldown via next API call */
  const dismiss = () => {
    setShouldShow(false);
    // Mark this session so we don't re-prompt without a page reload
    _writeSession(featureTag, false);
  };

  /** Called by ReviewModal after a successful submit */
  const markSubmitted = () => {
    setShouldShow(false);
    _writeSession(featureTag, false);
  };

  return { shouldShow, dismiss, markSubmitted };
}

// ─── session cache helpers ────────────────────────────────────────────────────
// Uses sessionStorage (cleared when the tab closes) so the backend remains
// the authoritative source across sessions.

function _readSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "{}");
  } catch {
    return {};
  }
}

function _writeSession(featureTag, value) {
  try {
    const cache = _readSession();
    cache[featureTag] = value;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(cache));
  } catch {
    // sessionStorage unavailable — silently ignore
  }
}
