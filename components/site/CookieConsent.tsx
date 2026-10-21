"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { Modal } from "@/components/site/Modal";

type Preferences = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

const defaultPreferences: Preferences = {
  necessary: true,
  functional: true,
  analytics: false,
  marketing: false,
};

const STORAGE_KEY = site.consentKey;

export function CookieConsent() {
  const [ready, setReady] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<Preferences>;
        setPreferences({ ...defaultPreferences, ...parsed, necessary: true });
      } catch {
        setPreferences(defaultPreferences);
      }
      setReady(true);
      return;
    }
    setReady(true);
    setShowBanner(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("consent-open", showBanner);
    return () => document.body.classList.remove("consent-open");
  }, [showBanner]);

  const persist = (next: Preferences) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...next, necessary: true, version: 1, updatedAt: new Date().toISOString() }),
      );
    } catch {
      // Storage can be blocked in private mode. The banner still dismisses.
    }
    setPreferences(next);
    setShowBanner(false);
    setShowModal(false);
    try {
      window.dispatchEvent(new Event("amos:consent"));
    } catch {
      // Older browsers without Event constructor simply keep the stored value.
    }
  };

  if (!ready) {
    return null;
  }

  return (
    <>
      {showBanner ? (
        <div
          className="cookie_banner fixed inset-x-0 bottom-0 z-[9999] border-t border-[#eee0da] bg-white shadow-[0_-10px_30px_rgba(70,36,29,0.12)]"
          role="region"
          aria-label="Cookie consent"
        >
          <div className="container-t flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-body text-[15px] font-semibold text-[#32221d]">
                We use cookies to keep Amos Blood working and to improve the service.
              </p>
              <p className="mt-1.5 font-body text-[13.5px] leading-relaxed text-[#6d5f59]">
                Necessary cookies keep sign in and forms working. Optional cookies help us understand
                how the site is used. You can change your choice at any time. We handle your data under
                the Kenya Data Protection Act, 2019. Read our{" "}
                <Link href="/legal/cookie-policy" className="text_link">
                  cookie policy
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="boxed-btn"
              >
                Manage preferences
              </button>
              <button
                type="button"
                onClick={() =>
                  persist({ ...preferences, functional: false, analytics: false, marketing: false })
                }
                className="boxed-btn"
              >
                Decline optional
              </button>
              <button
                type="button"
                onClick={() => persist({ necessary: true, functional: true, analytics: true, marketing: true })}
                className="boxed-btn4"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Cookie preferences"
        description="Choose what Amos Blood may store on this device."
      >
        <div className="grid gap-3">
          <div className="flat_card flex items-start justify-between gap-4">
            <div>
              <p className="font-body text-[14px] font-semibold text-[#32221d]">Necessary</p>
              <p className="mt-1 font-body text-[13px] leading-relaxed text-[#6d5f59]">
                Required for sign in, form security and your cookie choice. Always on.
              </p>
            </div>
            <span className="badge_base badge_standard">Locked</span>
          </div>

          {(
            [
              {
                key: "functional" as const,
                label: "Functional",
                copy: "Remembers your dashboard preferences and reduces repeated form entry.",
              },
              {
                key: "analytics" as const,
                label: "Analytics",
                copy: "Helps us see which pages help donors most. No medical details are collected.",
              },
              {
                key: "marketing" as const,
                label: "Marketing",
                copy: "Allows us to measure awareness campaigns for donor drives in your county.",
              },
            ]
          ).map((item) => (
            <label
              key={item.key}
              className="flat_card flex cursor-pointer items-start justify-between gap-4"
            >
              <span>
                <span className="block font-body text-[14px] font-semibold text-[#32221d]">
                  {item.label}
                </span>
                <span className="mt-1 block font-body text-[13px] leading-relaxed text-[#6d5f59]">
                  {item.copy}
                </span>
              </span>
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 flex-none accent-[#ad4a3a]"
                checked={preferences[item.key]}
                onChange={(event) =>
                  setPreferences((current) => ({ ...current, [item.key]: event.target.checked }))
                }
              />
            </label>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="boxed-btn4"
            onClick={() => persist({ ...preferences, necessary: true })}
          >
            Save my choices
          </button>
          <button
            type="button"
            className="boxed-btn"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
        <p className="mt-4 font-body text-[12px] leading-relaxed text-[#7d716a]">
          Your choice is stored in this browser only under the key {STORAGE_KEY}. You can clear it from
          your browser settings whenever you wish.
        </p>
      </Modal>
    </>
  );
}
