import type { Metadata } from "next";
import { Check, LockKeyhole } from "lucide-react";
import { RequestDemoForm } from "@/components/marketing/RequestDemoForm";

export const metadata: Metadata = { title: "Request Demo | SymplyUp Hotel Suite", description: "Request a guided demonstration of SymplyUp Hotel Suite for your hotel." };

const outcomes = ["See the Reservation Website and HMS working as one system", "Walk through bookings, rooms, guests, payments, and stays", "Discuss the plan and rollout approach suited to your property"];

export default function RequestDemoPage() {
  return (
    <div className="bg-background">
      <section className="border-b border-(--border)">
        <div className="marketing-container grid gap-12 py-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:py-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="marketing-eyebrow">Request a guided demo</p>
            <h1 className="marketing-display mt-5">See how SymplyUp would work inside your hotel.</h1>
            <p className="marketing-lead mt-6">Share a few practical details so the product conversation can focus on your property, staff workflow, and priorities.</p>
            <ul className="mt-9 border-t border-(--border)">{outcomes.map((outcome) => <li className="flex gap-3 border-b border-(--border) py-4 text-sm leading-6 text-(--text-strong)" key={outcome}><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-(--accent)" />{outcome}</li>)}</ul>
            <div className="mt-8 flex gap-3 text-sm leading-6 text-(--text-muted)"><LockKeyhole aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /><p>Your details are stored securely for demo follow-up. Live demo access appears after a successful request.</p></div>
          </div>
          <div className="border border-(--border) bg-(--surface) p-5 shadow-(--shadow-md) sm:p-8 lg:p-10">
            <div className="mb-8 border-b border-(--border) pb-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-(--brand-gold)">Hotel details</p><h2 className="mt-3 text-2xl font-semibold text-(--text-strong)">Tell us enough to make the walkthrough useful.</h2><p className="mt-3 text-sm leading-7 text-(--text-muted)">Most teams complete this in a few minutes.</p></div>
            <RequestDemoForm />
          </div>
        </div>
      </section>
    </div>
  );
}
