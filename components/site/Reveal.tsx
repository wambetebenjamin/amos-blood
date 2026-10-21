"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

type RevealState = "idle" | "hidden" | "shown";

/**
 * Scroll reveal that can never leave its content invisible.
 *
 * The server rendered markup (and the first client render) is fully visible, so
 * a failed hydration, a blocked script or an unsupported browser still shows
 * every section. Only after mount, and only when the block sits below the fold,
 * does the wrapper step out of the way and fade the content in as it enters the
 * viewport. An IntersectionObserver, a passive scroll/resize check and the print
 * stylesheet all act as independent safety nets.
 */
export function Reveal({ children, delay = 0, y = 18, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [state, setState] = useState<RevealState>("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === "undefined") {
      return;
    }

    if (reduced) {
      setState("shown");
      return;
    }

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const start = node.getBoundingClientRect();

    // Anything already on screen, even partially, stays exactly where it is.
    // Nothing ever flashes out.
    if (start.top < viewportHeight) {
      setState("shown");
      return;
    }

    setState("hidden");

    let settled = false;
    let observer: IntersectionObserver | null = null;
    let poll = 0;

    const cleanup = () => {
      observer?.disconnect();
      observer = null;
      window.clearInterval(poll);
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("resize", checkPosition);
      window.removeEventListener("beforeprint", show);
    };

    const show = () => {
      if (settled) {
        return;
      }
      settled = true;
      setState("shown");
      cleanup();
    };

    function checkPosition() {
      if (!node) {
        return;
      }
      if (!node.isConnected) {
        settled = true;
        cleanup();
        return;
      }
      const box = node.getBoundingClientRect();
      const height = window.innerHeight || document.documentElement.clientHeight || 0;
      if (box.top < height && box.bottom > 0) {
        show();
      }
    }

    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            show();
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
      );
      observer.observe(node);
    }

    // Some browsers, prerenderers and extensions quietly drop observers. This
    // polling check runs until the block has been revealed, so the animation
    // can never be the reason a section stays invisible.
    poll = window.setInterval(checkPosition, 1200);

    window.addEventListener("scroll", checkPosition, { passive: true });
    window.addEventListener("resize", checkPosition);
    window.addEventListener("beforeprint", show);

    return cleanup;
  }, [reduced]);

  return (
    <motion.div
      ref={ref}
      className={className}
      data-reveal
      initial={false}
      animate={state === "hidden" ? { opacity: 0, y } : { opacity: 1, y: 0 }}
      transition={
        state === "shown"
          ? { duration: 0.55, ease: [0.22, 0.61, 0.36, 1], delay }
          : { duration: 0 }
      }
    >
      {children}
    </motion.div>
  );
}
