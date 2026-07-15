import { Check, Hotel, Paintbrush, Settings2, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { MarketingFinalBand, MarketingPageHero } from "./MarketingPrimitives";
import { MarketingDisclosureList } from "./MarketingDisclosureList";
import { SectionHeader } from "./SectionHeader";

const plans = [
  { name: "Starter", fit: "Guest houses and small hotels moving daily records online.", features: ["Reservation Website", "Room and guest management", "Booking management", "Payment tracking", "Staff login"] },
  { name: "Professional", fit: "Growing hotels that need connected front desk operations.", recommended: true, features: ["Everything in Starter", "Check-in and check-out", "Reports dashboard", "Staff roles", "White-label reservation website", "Guided onboarding"] },
  { name: "Enterprise", fit: "Larger hotels with advanced deployment and support needs.", features: ["Everything in Professional", "Advanced deployment support", "Custom onboarding", "Future multi-property readiness", "Priority support"] },
];

const comparison = [
  ["Reservation Website", "Included", "Included", "Included"],
  ["Rooms, guests, and bookings", "Included", "Included", "Included"],
  ["Payment tracking", "Included", "Included", "Included"],
  ["Check-in and check-out", "Basic", "Included", "Included"],
  ["Staff roles", "Basic", "Included", "Advanced"],
  ["Reports dashboard", "Basic", "Included", "Advanced"],
  ["White-label branding", "Available", "Included", "Advanced"],
  ["Deployment support", "Standard", "Guided", "Advanced"],
  ["Priority support", "—", "Available", "Included"],
];

const factors: Array<{ title: string; description: string; icon: LucideIcon }> = [
  { title: "Hotel size", description: "Room count and operational volume establish the scale of the setup.", icon: Hotel },
  { title: "Workflow depth", description: "Staff roles, stay workflows, reporting, and front desk needs shape the plan fit.", icon: Settings2 },
  { title: "Branding", description: "The level of reservation website customization is agreed during discovery.", icon: Paintbrush },
  { title: "Onboarding and support", description: "Larger teams may need more structured rollout, training, and ongoing support.", icon: UsersRound },
];

const faqs = [
  ["Why are there no fixed public prices?", "Hotel size, staffing, branding, and deployment needs vary. A short discovery conversation lets us recommend a plan without charging every property for requirements it does not have."],
  ["Is the Reservation Website included?", "Yes. SymplyUp is designed as one suite: the guest-facing Reservation Website and the internal Hotel Management System work together."],
  ["Can a small hotel start with SymplyUp?", "Yes. Starter is intended for guest houses and small hotels that need a clearer way to manage reservations, rooms, guests, and payments."],
  ["Can the plan change as the hotel grows?", "Yes. The plan structure supports a hotel moving from basic digitization into deeper staff workflows, reporting, branding, and support."],
];

export function PricingPageContent() {
  return (
    <>
      <MarketingPageHero
        description="Pricing reflects your room count, operating workflow, branding requirements, and the level of onboarding your team needs. A guided demo gives us enough context to recommend the right fit."
        eyebrow="Pricing"
        secondaryHref="/features"
        secondaryLabel="See Features"
        title="A plan shaped around the way your hotel operates."
        visual={<PricingVisual />}
      />

      <section className="marketing-section border-y border-(--border) bg-(--surface-muted)">
        <div className="marketing-container">
          <SectionHeader description="Every plan connects the public reservation experience to hotel operations. The difference is the depth of workflow, deployment, and support." eyebrow="Plans" title="Start with the level of support your hotel needs." />
          <div className="mt-12 grid border border-(--border) lg:grid-cols-3">
            {plans.map((plan) => <Plan key={plan.name} {...plan} />)}
          </div>
          <p className="mt-5 text-sm text-(--text-muted)">No public fixed pricing yet. Your quote is prepared after we understand the hotel&apos;s size and workflow.</p>
        </div>
      </section>

      <section className="marketing-section bg-background">
        <div className="marketing-container">
          <SectionHeader description="Use this as a starting point. Final scope is confirmed after the product conversation." eyebrow="Compare plans" title="See how capability expands across each plan." />
          <div className="mt-12 overflow-x-auto border border-(--border)" tabIndex={0} aria-label="Plan comparison table">
            <table className="min-w-[760px] w-full border-collapse text-left text-sm">
              <thead className="bg-(--surface-muted) text-(--text-strong)"><tr><th className="p-4 font-semibold">Capability</th>{plans.map((plan) => <th className="p-4 font-semibold" key={plan.name}>{plan.name}</th>)}</tr></thead>
              <tbody>{comparison.map(([feature, ...values]) => <tr className="border-t border-(--border)" key={feature}><th className="p-4 font-medium text-(--text-strong)" scope="row">{feature}</th>{values.map((value, index) => <td className="p-4 text-(--text-muted)" key={`${feature}-${plans[index].name}`}>{value}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-y border-(--border) bg-(--brand-footer) text-white">
        <div className="marketing-container grid gap-12 py-16 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:py-20">
          <div><p className="marketing-eyebrow text-(--brand-gold-soft)">How pricing is decided</p><h2 className="mt-4 text-3xl font-semibold sm:text-4xl">A transparent conversation about the work involved.</h2><p className="mt-5 max-w-lg text-base leading-8 text-white/68">We price the operating setup your hotel will actually use, rather than applying one generic package to every property.</p></div>
          <div className="border-t border-white/14">{factors.map(({ title, description, icon: Icon }) => <div className="grid gap-3 border-b border-white/14 py-6 sm:grid-cols-[2.5rem_0.6fr_1fr]" key={title}><Icon aria-hidden="true" className="h-5 w-5 text-(--brand-gold-soft)" /><h3 className="font-semibold">{title}</h3><p className="text-sm leading-7 text-white/64">{description}</p></div>)}</div>
        </div>
      </section>

      <section className="marketing-section bg-background">
        <div className="marketing-container grid gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20">
          <div><p className="marketing-eyebrow">Pricing questions</p><h2 className="marketing-heading mt-4">What buyers usually want clarified.</h2></div>
          <MarketingDisclosureList items={faqs.map(([question, answer]) => ({ question, answer }))} openFirst />
        </div>
      </section>

      <MarketingFinalBand description="A guided demo gives us the context to recommend the right plan and explain what is included before you make a decision." eyebrow="Get a tailored recommendation" secondaryHref="/features" secondaryLabel="See Features" title="Choose a plan based on your hotel, not a generic price list." />
    </>
  );
}

function PricingVisual() {
  return <div className="border border-(--border) bg-(--surface) p-6 shadow-(--shadow-md)"><p className="text-xs font-bold uppercase tracking-[0.14em] text-(--brand-gold)">Your plan considers</p><div className="mt-5 grid grid-cols-2 border-l border-t border-(--border)">{["Room count", "Staff workflow", "Hotel branding", "Rollout support"].map((item, index) => <div className="border-b border-r border-(--border) p-4" key={item}><span className="text-xs text-(--text-muted)">0{index + 1}</span><p className="mt-2 text-sm font-semibold text-(--text-strong)">{item}</p></div>)}</div></div>;
}

function Plan({ features, fit, name, recommended = false }: { features: string[]; fit: string; name: string; recommended?: boolean }) {
  return <article className={`relative flex flex-col border-b border-(--border) p-7 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0 ${recommended ? "bg-(--surface)" : "bg-transparent"}`}>{recommended ? <span className="absolute right-5 top-5 text-xs font-bold uppercase tracking-[0.12em] text-(--brand-gold)">Recommended</span> : null}<p className="text-xs font-bold uppercase tracking-[0.14em] text-(--text-muted)">SymplyUp</p><h3 className="mt-4 text-2xl font-semibold text-(--text-strong)">{name}</h3><p className="mt-4 min-h-14 text-sm leading-7 text-(--text-muted)">{fit}</p><ul className="mt-7 space-y-3 border-t border-(--border) pt-6">{features.map((feature) => <li className="flex gap-3 text-sm text-(--text-strong)" key={feature}><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-(--accent)" />{feature}</li>)}</ul><Link className="mt-8 inline-flex h-11 items-center justify-center border border-(--text-strong) bg-(--text-strong) px-5 text-sm font-semibold text-(--background) transition hover:opacity-85" href="/request-demo">Request Demo</Link></article>;
}
