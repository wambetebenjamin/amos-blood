"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeartPulse, Hospital, ShieldCheck, Users } from "lucide-react";
import { impactStats } from "@/lib/site";

const icons = {
  users: Users,
  heart: HeartPulse,
  check: ShieldCheck,
  hospital: Hospital,
} as const;

export function StatCounter() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) {
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(
      root.current.querySelectorAll<HTMLElement>("[data-counter]"),
    );

    if (reduced) {
      nodes.forEach((node) => {
        node.textContent = Number(node.dataset.counter || 0).toLocaleString("en-KE");
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      nodes.forEach((node) => {
        const target = Number(node.dataset.counter || 0);
        const state = { value: 0 };
        gsap.to(state, {
          value: target,
          duration: 1.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: node,
            start: "top 88%",
            once: true,
          },
          onUpdate: () => {
            node.textContent = Math.round(state.value).toLocaleString("en-KE");
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="impact_band" ref={root}>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {impactStats.map((stat) => {
          const Icon = icons[stat.icon];
          return (
            <div className="impact_item" key={stat.label}>
              <Icon size={46} strokeWidth={1.4} className="icon" aria-hidden="true" />
              <div>
                <h3 data-counter={stat.value}>{stat.value.toLocaleString("en-KE")}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
