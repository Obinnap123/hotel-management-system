import {
  BarChart3,
  BedDouble,
  CalendarCheck,
  Check,
  CreditCard,
  Globe2,
  KeyRound,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  MarketingFinalBand,
  MarketingPageHero,
} from "./MarketingPrimitives";
import { SectionHeader } from "./SectionHeader";

const modules: Array<{
  title: string;
  description: string;
  outcome: string;
  capabilities: string[];
  icon: LucideIcon;
}> = [
  {
    title: "Booking Management",
    description: "Keep the booking lifecycle visible from reservation through cancellation, payment, arrival, and departure.",
    outcome: "Staff always know what should happen next.",
    capabilities: ["Booking dates and status", "Guest and room assignment", "Cancellation history"],
    icon: CalendarCheck,
  },
  {
    title: "Room Management",
    description: "Organize room types, individual rooms, prices, capacity, and operational room status in one inventory.",
    outcome: "Availability reflects what is happening in the hotel.",
    capabilities: ["Room types and pricing", "Capacity and inventory", "Reserved and occupied status"],
    icon: BedDouble,
  },
  {
    title: "Guest Management",
    description: "Maintain reusable guest records so reception teams can find accurate contact and stay information quickly.",
    outcome: "Guest information stays available across bookings.",
    capabilities: ["Searchable guest records", "Contact information", "Booking relationships"],
    icon: UsersRound,
  },
  {
    title: "Payment Tracking",
    description: "Record physical payments against the booking they belong to and preserve a clear revenue history.",
    outcome: "Recorded revenue is easier to review and explain.",
    capabilities: ["Booking-linked payments", "Payment methods", "Staff audit trail"],
    icon: CreditCard,
  },
  {
    title: "Check-In and Check-Out",
    description: "Move active stays through arrival and departure while booking and room status remain synchronized.",
    outcome: "Room occupancy stays accurate without duplicate updates.",
    capabilities: ["Paid-booking checks", "Arrival and departure timestamps", "Room status synchronization"],
    icon: KeyRound,
  },
  {
    title: "Staff Roles",
    description: "Separate administrator decisions from reception work with role-based access designed around hotel responsibilities.",
    outcome: "Staff see the tools required for their role.",
    capabilities: ["Admin and Receptionist roles", "Protected administration", "Account activation controls"],
    icon: ShieldCheck,
  },
  {
    title: "Dashboard and Reports",
    description: "Bring room status, arrivals, departures, active stays, guests, and recorded revenue into one operational overview.",
    outcome: "Owners understand the hotel without chasing records.",
    capabilities: ["Daily operational snapshot", "Occupancy visibility", "Revenue summaries"],
    icon: BarChart3,
  },
];

const workflow = ["Guest reserves", "Booking enters HMS", "Payment is recorded", "Guest checks in", "Room returns after checkout", "Dashboard reflects activity"];

export function FeaturesPageContent() {
  return (
    <>
      <MarketingPageHero
        description="SymplyUp combines a public Reservation Website with the internal Hotel Management System staff use to manage every booking, guest, room, payment, arrival, and departure."
        eyebrow="Product capabilities"
        secondaryHref="#feature-modules"
        secondaryLabel="Explore Modules"
        title="Purpose-built tools for connected hotel operations."
        visual={<FeatureHeroVisual />}
      />

      <section className="marketing-section bg-(--surface-muted)">
        <div className="marketing-container">
          <SectionHeader
            description="The guest experience and staff workspace have different jobs, but they operate on the same booking lifecycle."
            eyebrow="Two connected systems"
            title="A clearer experience for guests. A stronger operating view for staff."
          />
          <div className="mt-12 grid border border-(--border) lg:grid-cols-2">
            <SystemPanel
              capabilities={["Room type discovery", "Availability search", "Reservation capture", "Booking confirmation"]}
              description="A branded hotel website designed to turn room interest into direct reservation requests."
              icon={Globe2}
              label="Guest-facing"
              title="Reservation Website"
            />
            <SystemPanel
              capabilities={["Bookings and rooms", "Guests and payments", "Check-in and check-out", "Staff roles and reporting"]}
              dark
              description="A secure operational workspace designed around the work hotel teams perform every day."
              icon={ShieldCheck}
              label="Staff-facing"
              title="Hotel Management System"
            />
          </div>
        </div>
      </section>

      <section className="marketing-section scroll-mt-18 bg-background" id="feature-modules">
        <div className="marketing-container">
          <SectionHeader
            description="Each module has a focused operational responsibility. Together they keep the full stay lifecycle understandable."
            eyebrow="Inside the platform"
            title="Tools designed around real hotel work."
          />
          <div className="mt-14 border-t border-(--border)">
            {modules.map((module, index) => (
              <ModuleRow index={index} key={module.title} {...module} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-(--border) bg-(--surface-muted)">
        <div className="marketing-container py-16 lg:py-20">
          <SectionHeader
            description="The value is not only in each module. It is in the way information moves between them without staff rebuilding the same record."
            eyebrow="Connected workflow"
            title="One booking carries the operation from reservation to reporting."
          />
          <ol className="mt-12 grid border-l border-t border-(--border) sm:grid-cols-2 lg:grid-cols-3">
            {workflow.map((step, index) => (
              <li className="border-b border-r border-(--border) bg-(--surface) p-5" key={step}>
                <span className="text-xs font-bold text-(--brand-gold)">0{index + 1}</span>
                <p className="mt-4 text-sm font-semibold text-(--text-strong)">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <MarketingFinalBand
        description="Request a guided walkthrough of the Reservation Website, HMS modules, and the operational workflow that connects them."
        eyebrow="See the complete workflow"
        secondaryHref="/pricing"
        secondaryLabel="See Pricing"
        title="Explore how each capability fits your hotel."
      />
    </>
  );
}

function FeatureHeroVisual() {
  return (
    <div className="border border-(--border) bg-(--surface) p-5 shadow-(--shadow-md)">
      <div className="border-b border-(--border) pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--brand-gold)">Booking lifecycle</p>
        <p className="mt-2 text-sm text-(--text-muted)">One record, shared across every operational step.</p>
      </div>
      <div className="mt-5 grid gap-0">
        {["Reservation Website", "Booking Management", "Payment Tracking", "Check-In / Check-Out", "Dashboard and Reports"].map((item, index, items) => (
          <div className="relative flex items-center gap-4 pb-5 last:pb-0" key={item}>
            {index < items.length - 1 ? <span aria-hidden="true" className="absolute left-3 top-7 h-[calc(100%-0.35rem)] w-px bg-(--border-strong)" /> : null}
            <span className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.6rem] font-bold ${index === 0 ? "border-(--brand-gold) bg-(--brand-gold-soft) text-(--brand-gold)" : "border-(--border-strong) bg-(--surface) text-(--text-muted)"}`}>{index + 1}</span>
            <span className="text-sm font-semibold text-(--text-strong)">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemPanel({ capabilities, dark = false, description, icon: Icon, label, title }: { capabilities: string[]; dark?: boolean; description: string; icon: LucideIcon; label: string; title: string }) {
  return (
    <article className={`p-7 sm:p-9 ${dark ? "bg-(--brand-footer) text-white" : "bg-(--surface)"}`}>
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className={`text-xs font-bold uppercase tracking-[0.14em] ${dark ? "text-(--brand-gold-soft)" : "text-(--brand-gold)"}`}>{label}</p>
          <h3 className={`mt-4 text-2xl font-semibold ${dark ? "text-white" : "text-(--text-strong)"}`}>{title}</h3>
        </div>
        <Icon aria-hidden="true" className={`h-5 w-5 ${dark ? "text-white/48" : "text-(--text-muted)"}`} />
      </div>
      <p className={`mt-5 max-w-xl text-sm leading-7 ${dark ? "text-white/62" : "text-(--text-muted)"}`}>{description}</p>
      <ul className={`mt-7 grid gap-3 border-t pt-6 text-sm sm:grid-cols-2 ${dark ? "border-white/12 text-white/78" : "border-(--border) text-(--text-strong)"}`}>
        {capabilities.map((capability) => <li className="flex gap-2.5" key={capability}><Check aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-(--brand-gold-soft)" : "text-(--accent)"}`} />{capability}</li>)}
      </ul>
    </article>
  );
}

function ModuleRow({ capabilities, description, icon: Icon, index, outcome, title }: { capabilities: string[]; description: string; icon: LucideIcon; index: number; outcome: string; title: string }) {
  return (
    <article className="grid gap-6 border-b border-(--border) py-8 lg:grid-cols-[4rem_0.72fr_1fr] lg:gap-10 lg:py-10">
      <div className="flex items-center justify-between lg:block">
        <span className="text-sm font-bold text-(--brand-gold)">0{index + 1}</span>
        <Icon aria-hidden="true" className="h-5 w-5 text-(--text-muted) lg:mt-8" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-(--text-strong)">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-(--text-muted)">{description}</p>
        <p className="mt-5 border-l-2 border-(--brand-gold) pl-4 text-sm font-semibold text-(--text-strong)">{outcome}</p>
      </div>
      <ul className="grid content-start gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {capabilities.map((capability) => <li className="border-t border-(--border) pt-3 text-sm text-(--text-muted)" key={capability}>{capability}</li>)}
      </ul>
    </article>
  );
}
