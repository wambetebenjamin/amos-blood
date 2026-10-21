"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1900;
const SKIP_AFTER = 1000;
const STORAGE_KEY = "amos_blood_preloaded";

/** sessionStorage can throw in private mode; the loader must still run. */
function readPreloaded() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markPreloaded() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Storage is optional. The loader simply plays once per page load.
  }
}

export function Preloader() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [reduced, setReduced] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (readPreloaded()) {
      return;
    }
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);
    setVisible(true);
    if (prefersReduced) {
      setProgress(100);
      const timer = window.setTimeout(() => finish(), 900);
      return () => window.clearTimeout(timer);
    }

    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const ratio = Math.min(1, (now - started) / DURATION);
      setProgress(Math.round(ratio * 100));
      if (ratio < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        finish();
      }
    };
    frame = window.requestAnimationFrame(tick);
    const skipTimer = window.setTimeout(() => setCanSkip(true), SKIP_AFTER);

    const finish = () => {
      if (finished.current) {
        return;
      }
      finished.current = true;
      markPreloaded();
      window.setTimeout(() => setVisible(false), 220);
    };

    const onKey = () => {
      if (performance.now() - started > SKIP_AFTER) {
        finish();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(skipTimer);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) {
    return null;
  }

  const skip = () => {
    if (!finished.current) {
      finished.current = true;
      markPreloaded();
      setVisible(false);
    }
  };

  return (
    <div className="preloader" role="status" aria-live="polite" aria-label="Loading Amos Blood">
      {reduced ? null : (
        <svg width="96" height="104" viewBox="0 0 96 104" fill="none" aria-hidden="true" focusable="false">
          <ellipse cx="48" cy="92" rx="34" ry="5.5" fill="#C8102E" opacity="0.12" />
          <ellipse className="ripple_one" cx="48" cy="92" rx="22" ry="3.6" stroke="#C8102E" strokeWidth="1.6" opacity="0" />
          <ellipse className="ripple_two" cx="48" cy="92" rx="22" ry="3.6" stroke="#C8102E" strokeWidth="1.4" opacity="0" />
          <g className="drop_fall">
            <path
              d="M48 16C48 16 30 37.5 30 50.2C30 60.3 38.1 68.4 48 68.4C57.9 68.4 66 60.3 66 50.2C66 37.5 48 16 48 16Z"
              fill="#C8102E"
            />
            <path
              d="M39.5 50.6C39.5 55.4 42.9 58.8 47.2 58.8"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>
        </svg>
      )}
      <span className="counter" aria-hidden="true">
        {progress}%
      </span>
      <span className="label">Loading Amos Blood</span>
      {reduced ? <span className="sr-only">Loading {progress} percent</span> : null}
      {canSkip && !reduced ? (
        <button
          type="button"
          onClick={skip}
          className="mt-4 font-body text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7d6c6f] underline underline-offset-4 hover:text-[#9a0c22]"
        >
          Skip
        </button>
      ) : null}
    </div>
  );
}
