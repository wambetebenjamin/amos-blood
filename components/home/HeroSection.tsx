"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, Droplets, HeartPulse, ShieldCheck } from "lucide-react";

export function HeroSection() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-line]", {
        y: 26,
        opacity: 0,
        duration: 0.85,
        stagger: 0.13,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.from("[data-hero-chip]", {
        y: 12,
        opacity: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power2.out",
        delay: 0.55,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="slider_area"
      aria-labelledby="hero-heading"
      style={{
        backgroundImage: "url(/images/hero-community-health.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="single_slider overlay2" style={{ position: "relative" }}>
        <div className="container-t w-full" ref={root}>
          <div className="slider_text">
            <span data-hero-line>
              <Droplets size={16} className="mr-2 inline align-[-2px]" aria-hidden="true" />
              Blood donation and medical supply matching, Kenya
            </span>
            <h1 id="hero-heading" data-hero-line>
              Your blood.
              <br />
              Someone&apos;s second chance.
            </h1>
            <p data-hero-line>
              Amos Blood connects verified donors with hospitals and blood banks across Kenya. Register
              your blood type once, then answer the call when a patient near you needs it. Hospitals can
              post an urgent request and reach donors in minutes.
            </p>
            <div className="slider_actions" data-hero-line>
              <Link href="/register-donor" className="boxed-btn3">
                Register as donor
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link href="/post-request" className="boxed-btn5">
                Post an urgent request
              </Link>
            </div>
            <div className="slider_note">
              <span data-hero-chip>
                <ShieldCheck size={16} aria-hidden="true" />
                Verified hospitals and blood banks
              </span>
              <span data-hero-chip>
                <HeartPulse size={16} aria-hidden="true" />
                Free for donors, always
              </span>
              <span data-hero-chip>
                <Droplets size={16} aria-hidden="true" />
                90 day safe donation interval
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
