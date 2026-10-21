"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

type GrecaptchaV3 = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

type GrecaptchaV2 = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
    },
  ) => number;
  reset: (id?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: GrecaptchaV3 & Partial<GrecaptchaV2>;
    __amosRecaptchaV2Ready?: () => void;
    __amosV2Renderer?: (token: string) => void;
  }
}

export const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

export function RecaptchaScript() {
  if (!recaptchaSiteKey) {
    return null;
  }
  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
      strategy="afterInteractive"
    />
  );
}

export async function executeRecaptcha(action: string): Promise<string | undefined> {
  if (!recaptchaSiteKey || typeof window === "undefined" || !window.grecaptcha) {
    return undefined;
  }
  try {
    return await new Promise<string>((resolve) => {
      window.grecaptcha!.ready(() => {
        window
          .grecaptcha!.execute(recaptchaSiteKey, { action })
          .then(resolve)
          .catch(() => resolve(""));
      });
    });
  } catch {
    return undefined;
  }
}

export function useRecaptcha(action: string) {
  const [needsFallback, setNeedsFallback] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);

  const execute = useCallback(async () => {
    const value = await executeRecaptcha(action);
    setToken(value);
    return value;
  }, [action]);

  return {
    execute,
    token,
    setToken,
    needsFallback,
    requestFallback: () => setNeedsFallback(true),
    resetFallback: () => setNeedsFallback(false),
  };
}

export function RecaptchaV2Fallback({
  onToken,
}: {
  onToken: (token: string) => void;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    window.__amosV2Renderer = onToken;
  }, [onToken]);

  useEffect(() => {
    const grecaptcha = window.grecaptcha;
    if (!scriptReady || !holder.current || !grecaptcha?.render || !recaptchaSiteKey) {
      return;
    }
    if (widgetId.current !== null) {
      return;
    }
    widgetId.current = grecaptcha.render(holder.current, {
      sitekey: recaptchaSiteKey,
      callback: (value: string) => window.__amosV2Renderer?.(value),
    });
  }, [scriptReady]);

  return (
    <div className="form_note">
      <p className="font-body text-[13px] font-semibold text-[#2f7f62]">
        One quick check before we continue
      </p>
      <p className="mt-1 font-body text-[12.5px] leading-relaxed text-[#4f7d6e]">
        Our automated check was not fully confident, so please confirm you are a real person.
      </p>
      <div ref={holder} className="mt-3 min-h-[78px]" />
      <Script
        src="https://www.google.com/recaptcha/api.js?render=explicit&onload=__amosRecaptchaV2Ready"
        strategy="afterInteractive"
        onLoad={() => {
          setScriptReady(true);
        }}
      />
    </div>
  );
}

export function RecaptchaNotice() {
  return (
    <p className="font-body text-[11.5px] leading-relaxed text-[#9a9a9a]">
      This form is protected by reCAPTCHA. The Google{" "}
      <a
        className="text_link text-[11.5px]"
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy Policy
      </a>{" "}
      and{" "}
      <a
        className="text_link text-[11.5px]"
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms of Service
      </a>{" "}
      apply.
    </p>
  );
}
