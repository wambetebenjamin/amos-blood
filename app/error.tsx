"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MessageCircle, RefreshCw } from "lucide-react";
import { whatsappHref } from "@/lib/site";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Amos Blood error boundary", error);
  }, [error]);

  return (
    <section className="section_padding bg-[#f7f7f7]">
      <div className="container-t">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Error 500</span>
          <h1 className="mt-4 text-[64px] leading-none text-[#191d34] sm:text-[92px]">500</h1>
          <h2 className="mt-4 text-[30px]">Something broke on our side</h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-[14.5px] leading-relaxed text-[#6b6a6a]">
            The page could not load. This is not your fault and no data was lost. Try again, and if a request
            is urgent, message a coordinator on WhatsApp so a person can help immediately.
          </p>

          {error.digest ? (
            <p className="mt-4 font-body text-[12px] text-[#9a9a9a]">
              Reference for support: <span className="font-semibold text-[#6b6a6a]">{error.digest}</span>
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={reset} className="boxed-btn4">
              <RefreshCw size={16} aria-hidden="true" />
              Try again
            </button>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="boxed-btn">
              <MessageCircle size={16} aria-hidden="true" />
              Message on WhatsApp
            </a>
          </div>

          <p className="mt-6 font-body text-[13px] text-[#8a8a8a]">
            Or return to the{" "}
            <Link href="/" className="text_link">
              homepage
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
