"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export type MarketingDisclosureItem = {
  question: string;
  answer: string;
};

export function MarketingDisclosureList({ items, openFirst = false }: { items: MarketingDisclosureItem[]; openFirst?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(openFirst ? 0 : null);
  const listId = useId();

  return (
    <div className="border-t border-(--border)">
      {items.map((item, index) => {
        const open = openIndex === index;
        const contentId = `${listId}-${index}`;
        return (
          <div className="border-b border-(--border)" key={item.question}>
            <button
              aria-controls={contentId}
              aria-expanded={open}
              className="flex min-h-16 w-full items-center justify-between gap-5 py-5 text-left font-semibold text-(--text-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--focus-ring)"
              onClick={() => setOpenIndex(open ? null : index)}
              type="button"
            >
              <span>{item.question}</span>
              <ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 text-(--text-muted) transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            <div className={open ? "block" : "hidden"} id={contentId}>
              <p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-(--text-muted)">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
