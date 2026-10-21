"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = { question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="rounded-[7px] bg-white px-5 shadow-[0_3px_6px_rgba(0,0,0,0.06)]">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div className="faq_item" key={item.question}>
            <h3 className="m-0">
              <button
                type="button"
                className="faq_trigger"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                id={`faq-trigger-${index}`}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span className="pr-4 text-[17px] leading-snug">{item.question}</span>
                <ChevronDown
                  size={18}
                  className={`flex-none text-[#ad4a3a] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            {isOpen ? (
              <div
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-trigger-${index}`}
                className="faq_panel"
              >
                <p>{item.answer}</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
