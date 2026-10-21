"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const SCRIPT =
  "Welcome to Amos Blood. We connect blood donors across Kenya with hospitals and patients who need help fast. If you have donated blood before or want to start, register your blood type today and we will notify you when someone near you urgently needs your type. If you work at a hospital, post an urgent request and reach verified donors in minutes. Every donation counts. Register now and be someone's second chance.";

export function VoiceTour() {
  const [supported, setSupported] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [completed, setCompleted] = useState(false);
  const spokenOnce = useRef(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(SCRIPT);
    utterance.rate = 0.94;
    utterance.pitch = 1.08;
    utterance.lang = "en-KE";
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const kenyan = voices.find((voice) => voice.lang === "en-KE");
    const eastAfrican = voices.find((voice) => voice.lang === "en-KE" || voice.lang === "sw-KE");
    const fallback = voices.find((voice) => voice.lang.startsWith("en-GB")) || voices.find((voice) => voice.lang.startsWith("en"));
    const chosen = kenyan || eastAfrican || fallback;
    if (chosen) {
      utterance.voice = chosen;
    }

    utterance.onstart = () => {
      setSpeaking(true);
      spokenOnce.current = true;
    };
    utterance.onend = () => {
      setSpeaking(false);
      setCompleted(true);
    };
    utterance.onerror = () => {
      setSpeaking(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }

    const onFirstInteraction = () => {
      if (spokenOnce.current) {
        return;
      }
      spokenOnce.current = true;
      speak();
      cleanup();
    };

    const onScroll = () => {
      if (window.scrollY > 180) {
        onFirstInteraction();
      }
    };

    const cleanup = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onFirstInteraction, { once: true });
    window.addEventListener("keydown", onFirstInteraction, { once: true });
    window.addEventListener("touchstart", onFirstInteraction, { once: true });

    return () => {
      cleanup();
      window.speechSynthesis.cancel();
    };
  }, [speak]);

  const toggle = () => {
    if (speaking) {
      stop();
      return;
    }
    speak();
  };

  const label = speaking
    ? "Site voice tour, click to mute"
    : completed
      ? "Site voice tour, click to replay"
      : "Site voice tour, click to play";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`floating_btn voice_btn${speaking ? " speaking" : ""}`}
      aria-label={supported ? label : "Site voice tour is not supported in this browser"}
      aria-pressed={speaking}
      disabled={!supported}
    >
      {speaking ? (
        <VolumeX size={24} aria-hidden="true" />
      ) : (
        <Volume2 size={24} aria-hidden="true" />
      )}
      <span className="floating_tip" role="tooltip">
        {completed ? "Replay tour" : "Hear what this site is about"}
      </span>
    </button>
  );
}
