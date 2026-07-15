import { ArrowRight, Check, Hotel, Layers3, Store, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { MarketingFinalBand, MarketingPageHero } from "./MarketingPrimitives";
import { SectionHeader } from "./SectionHeader";

const segments: Array<{ title: string; stage: string; description: string; focus: string[]; icon: LucideIcon }> = [
  {
    title: "Guest houses and small hotels",
    stage: "Move beyond manual records",
    description: "Bring reservations, rooms, guests, and payments out of notebooks and scattered messages without making daily work harder for a small team.",
    focus: ["One place for reservation records", "Clear room and guest visibility", "Simple payment history"],
    icon: Hotel,
  },
  {
    title: "Boutique hotels",
    stage: "Connect presentation to service",
    description: "Give guests a polished, hotel-branded reservation journey while keeping every request connected to the front desk operation behind it.",
    focus: ["Branded room presentation", "Direct reservation capture", "Consistent guest handover"],
    icon: Store,
  },
  {
    title: "Growing hotels",
    stage: "Coordinate a busier team",
    description: "As booking volume and staff activity increase, give receptionists focused workflows and owners a more reliable view of what is happening.",
    focus: ["Role-based staff access", "Arrival and departure workflows", "Daily operational oversight"],
    icon: UsersRound,
  },
  {
    title: "Hospitality teams",
    stage: "Prepare for more complexity",
    description: "Establish a stronger operating foundation for teams that need guided deployment, structured onboarding, and room to expand their setup later.",
    focus: ["Deployment support", "Structured onboarding", "Future multi-property readiness"],
    icon: Layers3,
  },
];

const workflow = [
  ["Reservation capture", "Guests reserve through the hotel-facing website."],
  ["Front desk control", "Bookings arrive in the HMS ready for staff action."],
  ["Stay operations", "Payments, check-in, room status, and checkout stay linked."],
  ["Owner visibility", "The dashboard reflects occupancy, revenue, and daily activity."],
];

export function SolutionsPageContent() {
  return (
    <>
      <MarketingPageHero
        description="SymplyUp adapts to where a hotel is today, from replacing paper records to coordinating a growing front desk, while preserving one connected operating model."
        eyebrow="Solutions"
        secondaryHref="/features"
        secondaryLabel="See Features"
        title="A practical operating system for hotels at every stage of growth."
        visual={<MaturityVisual />}
      />

      <section className="marketing-section border-y border-(--border) bg-(--surface-muted)">
        <div className="marketing-container">
          <SectionHeader
            description="Different properties feel different operational pressure. The right solution starts with the work the team needs to make clearer."
            eyebrow="Choose your starting point"
            title="Find the situation that sounds like your hotel."
          />
          <div className="mt-14 border-t border-(--border)">
            {segments.map((segment, index) => <SegmentStory index={index} key={segment.title} {...segment} />)}
          </div>
        </div>
      </section>

      <section className="marketing-section bg-background">
        <div className="marketing-container grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="marketing-eyebrow">A shared operating model</p>
            <h2 className="marketing-heading mt-4">The hotel may change. The booking journey stays connected.</h2>
            <p className="marketing-lead mt-5">Every segment benefits from the same clear movement of information from guest intent to front desk action and owner visibility.</p>
          </div>
          <ol className="border-t border-(--border)">
            {workflow.map(([title, description], index) => (
              <li className="grid gap-4 border-b border-(--border) py-7 sm:grid-cols-[3rem_0.7fr_1fr] sm:items-start" key={title}>
                <span className="text-sm font-bold text-(--brand-gold)">0{index + 1}</span>
                <h3 className="font-semibold text-(--text-strong)">{title}</h3>
                <p className="text-sm leading-7 text-(--text-muted)">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <MarketingFinalBand
        description="Tell us how your hotel works today. We will use the demo to show the workflows that matter most to your team."
        eyebrow="Find your fit"
        secondaryHref="/features"
        secondaryLabel="Explore Features"
        title="See how SymplyUp would support a hotel like yours."
      />
    </>
  );
}

function MaturityVisual() {
  return (
    <div className="border border-(--border) bg-(--surface) p-6 shadow-(--shadow-md)">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--brand-gold)">Operational growth</p>
      <div className="mt-6 border-l border-(--border-strong)">
        {["Organize records", "Coordinate the front desk", "Improve owner visibility", "Prepare to scale"].map((item, index) => (
          <div className="relative border-b border-(--border) py-4 pl-7 last:border-b-0" key={item}>
            <span className="absolute -left-2 top-5 h-4 w-4 rounded-full border-4 border-(--surface) bg-(--brand-gold)" />
            <p className="text-xs text-(--text-muted)">Stage {index + 1}</p>
            <p className="mt-1 font-semibold text-(--text-strong)">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SegmentStory({ description, focus, icon: Icon, index, stage, title }: { description: string; focus: string[]; icon: LucideIcon; index: number; stage: string; title: string }) {
  return (
    <article className="grid gap-7 border-b border-(--border) py-9 lg:grid-cols-[4rem_0.8fr_1fr] lg:gap-10 lg:py-12">
      <div className="flex items-center justify-between lg:block">
        <span className="text-sm font-bold text-(--brand-gold)">0{index + 1}</span>
        <Icon aria-hidden="true" className="h-5 w-5 text-(--text-muted) lg:mt-9" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--text-muted)">{stage}</p>
        <h3 className="mt-3 text-2xl font-semibold text-(--text-strong)">{title}</h3>
        <p className="mt-4 text-sm leading-7 text-(--text-muted)">{description}</p>
      </div>
      <div className="self-start border-l-2 border-(--brand-gold) pl-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--text-muted)">What improves first</p>
        <ul className="mt-4 space-y-3">
          {focus.map((item) => <li className="flex gap-3 text-sm text-(--text-strong)" key={item}><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-(--accent)" />{item}</li>)}
        </ul>
        <Link className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-(--text-strong) hover:text-(--brand-gold)" href="/request-demo">Discuss this setup <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
      </div>
    </article>
  );
}
