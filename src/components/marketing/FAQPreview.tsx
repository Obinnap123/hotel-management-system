"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { MarketingEyebrow } from "./MarketingPrimitives";

const faqs = [
  { question: "Is SymplyUp only a booking website?", answer: "No. SymplyUp includes both a public Reservation Website and an internal Hotel Management System, so guest reservations flow directly into hotel operations." },
  { question: "Do guests need accounts?", answer: "No. Guests can submit reservations without creating accounts. Staff manage the operational workflow inside the HMS." },
  { question: "Can receptionists use the system?", answer: "Yes. Receptionists can manage guests, bookings, payments, check-ins, and check-outs according to their role permissions." },
  { question: "Does SymplyUp include payment tracking?", answer: "Yes. Hotels can record physical payments against bookings for a clearer and permanent revenue history." },
  { question: "Can the reservation website use my hotel branding?", answer: "Yes. The guest-facing reservation experience is designed to support a branded deployment for each hotel." },
  { question: "How does pricing work?", answer: "Pricing is tailored to hotel size, workflow needs, branding, onboarding, and deployment requirements." },
];

export function FAQPreview() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="marketing-section border-y border-(--border) bg-(--surface-muted)">
      <div className="marketing-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="max-w-lg">
          <MarketingEyebrow>Common questions</MarketingEyebrow>
          <h2 className="marketing-heading mt-5">
            The details hotel owners ask before a demo.
          </h2>
          <p className="marketing-lead mt-5">
            Clear answers about the product, guest experience, staff access,
            payments, branding, and pricing.
          </p>
          <Link
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-(--text-strong) transition hover:text-(--brand-gold) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--ring)"
            href="/faq"
          >
            View every question
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        <div className="border-t border-(--border)">
          {faqs.map((faq, index) => (
            <FAQRow
              answer={faq.answer}
              index={index}
              isOpen={openIndex === index}
              key={faq.question}
              onToggle={() => setOpenIndex((current) => (current === index ? -1 : index))}
              question={faq.question}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQRow({
  answer,
  index,
  isOpen,
  onToggle,
  question,
}: {
  answer: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  question: string;
}) {
  const id = useId();
  const panelId = `${id}-panel`;

  return (
    <article className="border-b border-(--border)">
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="grid min-h-20 w-full grid-cols-[2rem_1fr_auto] items-center gap-3 py-4 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--ring)"
        onClick={onToggle}
        type="button"
      >
        <span className="text-xs font-bold text-(--brand-gold)">0{index + 1}</span>
        <span className="text-base font-semibold text-(--text-strong)">{question}</span>
        <Plus
          aria-hidden="true"
          className={`h-5 w-5 text-(--text-muted) transition-transform ${isOpen ? "rotate-45" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            role="region"
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="pb-6 pl-11 pr-10 text-sm leading-7 text-(--text-muted)">{answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}
