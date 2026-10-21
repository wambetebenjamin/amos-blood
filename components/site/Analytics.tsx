"use client";

import { useEffect, useState } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/lib/site";

type ConsentRecord = {
  analytics?: boolean;
};

function readConsent(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const dnt =
    window.navigator.doNotTrack === "1" ||
    (window as Window & { msDoNotTrack?: string }).msDoNotTrack === "1";
  if (dnt) {
    return false;
  }
  try {
    const raw = window.localStorage.getItem(site.consentKey);
    if (!raw) {
      return false;
    }
    const parsed = JSON.parse(raw) as ConsentRecord;
    return parsed.analytics === true;
  } catch {
    return false;
  }
}

export function Analytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setEnabled(readConsent());
    sync();
    window.addEventListener("amos:consent", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("amos:consent", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
    </>
  );
}
