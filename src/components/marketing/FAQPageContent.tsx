import { CircleHelp, Globe2, KeyRound, MonitorCog, ReceiptText, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MarketingDisclosureList, type MarketingDisclosureItem } from "./MarketingDisclosureList";
import { MarketingFinalBand, MarketingPageHero } from "./MarketingPrimitives";

const categories: Array<{ id: string; title: string; summary: string; icon: LucideIcon; items: MarketingDisclosureItem[] }> = [
  { id: "product", title: "Product overview", summary: "Understand what the complete suite includes.", icon: CircleHelp, items: [
    { question: "Is SymplyUp only a booking website?", answer: "No. SymplyUp combines a public Reservation Website with an internal Hotel Management System for rooms, guests, bookings, payments, check-in, checkout, staff access, and operational reporting." },
    { question: "Is SymplyUp suitable for small hotels?", answer: "Yes. The platform supports guest houses and small hotels moving away from manual records, as well as growing properties that need deeper front desk workflows." },
    { question: "Is the platform cloud hosted?", answer: "Yes. SymplyUp is designed as a cloud-based hotel operating platform, so authorized staff can work from the hotel deployment without maintaining an on-site server." },
  ]},
  { id: "reservation", title: "Reservation Website", summary: "How guests discover rooms and send reservations.", icon: Globe2, items: [
    { question: "Do guests need accounts?", answer: "No. Guests can browse room types and submit a reservation without creating an account. Staff manage the reservation inside the HMS." },
    { question: "How does the Reservation Website connect to the HMS?", answer: "Both experiences use the same hotel data and booking workflow. An online reservation enters the HMS so staff can act on it without recreating the record." },
    { question: "Can the website use my hotel's branding?", answer: "Yes. Hotel deployments are designed to support the property's name, room content, imagery, and a white-label guest experience based on the selected setup." },
  ]},
  { id: "operations", title: "Hotel operations", summary: "What staff can manage after a reservation arrives.", icon: MonitorCog, items: [
    { question: "Can staff manage online reservations immediately?", answer: "Yes. Once created, the booking becomes visible to authorized staff in Booking Management and follows the same operational lifecycle as a staff-created booking." },
    { question: "What happens at check-in and checkout?", answer: "Check-in records the staff member and time, moves the booking into an active stay, and marks the room occupied. Checkout records departure, closes the stay, and makes the room available again." },
    { question: "What can owners see on the dashboard?", answer: "The operational dashboard summarizes rooms, arrivals, departures, active stays, guests, recorded payments, and revenue information generated from hotel records." },
  ]},
  { id: "access", title: "Staff roles and access", summary: "How administrative and front desk responsibilities stay separate.", icon: KeyRound, items: [
    { question: "Can receptionists use the system?", answer: "Yes. Receptionists can manage daily workflows such as guests, bookings, payments, check-ins, and checkouts within their assigned permissions." },
    { question: "Can administrators control staff access?", answer: "Yes. Administrators can create staff accounts, assign Admin or Receptionist roles, activate or deactivate accounts, and reset passwords without exposing stored passwords." },
    { question: "Do hotel guests get access to the HMS?", answer: "No. The HMS login is only for hotel staff. Guests use the public Reservation Website and do not receive internal accounts." },
  ]},
  { id: "payments", title: "Payments and records", summary: "How physical payments connect to booking history.", icon: ReceiptText, items: [
    { question: "Does SymplyUp include online payment gateways?", answer: "The current suite records physical payments received by hotel staff. Online gateway processing, refunds, installments, and partial payments are outside the present MVP scope." },
    { question: "How is payment history protected?", answer: "Payments are connected to bookings, record the staff member who received them, and are treated as immutable records rather than editable transactions." },
  ]},
  { id: "pricing", title: "Pricing and deployment", summary: "Plans, rollout, and how the suite can grow with a hotel.", icon: Rocket, items: [
    { question: "How does pricing work?", answer: "Pricing is tailored to room count, workflow depth, branding, onboarding, deployment, and support requirements. Requesting a demo gives us the context to recommend a suitable plan." },
    { question: "Can the plan change as the hotel grows?", answer: "Yes. A hotel can move from basic digitization into deeper workflows, reporting, branding, deployment support, and future expansion as its needs change." },
    { question: "What happens after I request a demo?", answer: "Your request is saved for follow-up, you receive access to the live demo experience, and the team can use your hotel details to guide a more relevant product conversation." },
  ]},
];

export function FAQPageContent() {
  return (
    <>
      <MarketingPageHero description="Clear answers about the Reservation Website, hotel operations, staff access, payment records, pricing, and deployment." eyebrow="Frequently asked questions" secondaryHref="/pricing" secondaryLabel="See Pricing" title="Understand the platform before the product conversation." visual={<FAQIndex />} />

      <section className="marketing-section border-y border-(--border) bg-(--surface-muted)">
        <div className="marketing-container grid gap-12 lg:grid-cols-[0.58fr_1.42fr] lg:gap-20">
          <nav aria-label="FAQ categories" className="lg:sticky lg:top-28 lg:self-start"><p className="marketing-eyebrow">Browse by topic</p><ul className="mt-6 border-t border-(--border)">{categories.map(({ id, title }) => <li className="border-b border-(--border)" key={id}><a className="block py-4 text-sm font-semibold text-(--text-muted) hover:text-(--text-strong)" href={`#${id}`}>{title}</a></li>)}</ul></nav>
          <div className="space-y-16">{categories.map(({ id, items, summary, title, icon: Icon }) => <section className="scroll-mt-28" id={id} key={id}><div className="grid gap-4 pb-7 sm:grid-cols-[2.5rem_0.7fr_1fr]"><Icon aria-hidden="true" className="h-5 w-5 text-(--brand-gold)" /><h2 className="text-xl font-semibold text-(--text-strong)">{title}</h2><p className="text-sm leading-7 text-(--text-muted)">{summary}</p></div><MarketingDisclosureList items={items} openFirst={id === "product"} /></section>)}</div>
        </div>
      </section>

      <MarketingFinalBand description="A guided demo is the fastest way to see how the guest journey and staff operation fit together for your property." eyebrow="Still evaluating?" secondaryHref="/pricing" secondaryLabel="See Pricing" title="Bring your hotel questions into the product walkthrough." />
    </>
  );
}

function FAQIndex() {
  return <div className="border border-(--border) bg-(--surface) p-6 shadow-(--shadow-md)"><p className="text-xs font-bold uppercase tracking-[0.14em] text-(--brand-gold)">Six useful topics</p><div className="mt-5 grid border-l border-t border-(--border) sm:grid-cols-2">{categories.map(({ id, title }, index) => <a className="border-b border-r border-(--border) p-4 text-sm font-semibold text-(--text-strong) hover:bg-(--surface-muted)" href={`#${id}`} key={id}><span className="mr-3 text-xs text-(--brand-gold)">0{index + 1}</span>{title}</a>)}</div></div>;
}
