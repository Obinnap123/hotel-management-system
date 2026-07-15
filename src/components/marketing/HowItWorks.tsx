import {
  BarChart3,
  CalendarCheck,
  Globe2,
  KeyRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MarketingEyebrow } from "./MarketingPrimitives";

const steps: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: "Launch a branded reservation website",
    description: "Guests discover rooms and submit reservations through a hotel-branded experience.",
    icon: Globe2,
  },
  {
    title: "Reservations enter the HMS",
    description: "Every online request becomes an operational booking staff can manage immediately.",
    icon: CalendarCheck,
  },
  {
    title: "Staff manage the stay",
    description: "Reception handles guests, payments, check-in, check-out, and room status from one workspace.",
    icon: KeyRound,
  },
  {
    title: "Owners see the operation clearly",
    description: "Dashboard reporting brings occupancy, activity, and recorded revenue into view.",
    icon: BarChart3,
  },
];

export function HowItWorks() {
  return (
    <section className="marketing-section bg-background">
      <div className="marketing-container">
        <div className="max-w-3xl">
          <MarketingEyebrow>How it works</MarketingEyebrow>
          <h2 className="marketing-heading mt-5">
            From online reservation to checkout, every step stays connected.
          </h2>
          <p className="marketing-lead mt-5">
            Guest activity enters the same operational workflow hotel staff use
            every day. Nothing needs to be copied between separate systems.
          </p>
        </div>

        <ol className="mt-14 grid border-t border-(--border) lg:grid-cols-4">
          {steps.map(({ description, icon: Icon, title }, index) => (
            <li
              className="relative border-b border-(--border) py-7 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              key={title}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-4xl font-semibold text-(--border-strong)">
                  0{index + 1}
                </span>
                <Icon aria-hidden="true" className="h-5 w-5 text-(--brand-gold)" />
              </div>
              <h3 className="mt-8 text-lg font-semibold text-(--text-strong)">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-(--text-muted)">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
