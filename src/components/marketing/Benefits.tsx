import {
  ArrowDownRight,
  BarChart3,
  CalendarDays,
  Clock3,
  MonitorSmartphone,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MarketingCTA } from "./MarketingCTA";
import { MarketingEyebrow } from "./MarketingPrimitives";

const benefits: Array<{ title: string; description: string; icon: LucideIcon }> = [
  { title: "Reduce manual coordination", description: "Keep reservation, guest, room, payment, and stay records in one operational flow.", icon: Clock3 },
  { title: "Protect room availability", description: "Give staff clearer booking dates and room status instead of relying on memory or separate sheets.", icon: CalendarDays },
  { title: "Make front desk work easier", description: "Give receptionists focused workflows for the tasks they perform most often.", icon: UsersRound },
  { title: "Improve owner visibility", description: "Review active stays, arrivals, departures, occupancy, and recorded revenue faster.", icon: BarChart3 },
  { title: "Present the hotel professionally", description: "Use a branded reservation experience that connects directly to internal operations.", icon: MonitorSmartphone },
];

export function Benefits() {
  return (
    <section className="marketing-section border-y border-(--border) bg-(--surface-muted)">
      <div className="marketing-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <MarketingEyebrow>Business outcomes</MarketingEyebrow>
          <h2 className="marketing-heading mt-5">
            Less operational friction. More control over the hotel.
          </h2>
          <p className="marketing-lead mt-5 max-w-xl">
            SymplyUp is designed around the practical results hotel owners and
            front desk teams need from their software.
          </p>
          <MarketingCTA className="mt-8" />
        </div>

        <div className="border-t border-(--border)">
          {benefits.map(({ description, icon: Icon, title }, index) => (
            <article
              className="group grid gap-4 border-b border-(--border) py-6 sm:grid-cols-[3.5rem_1fr_auto] sm:items-start"
              key={title}
            >
              <span className="text-sm font-bold text-(--brand-gold)">0{index + 1}</span>
              <div>
                <div className="flex items-center gap-3">
                  <Icon aria-hidden="true" className="h-4 w-4 text-(--text-muted)" />
                  <h3 className="text-lg font-semibold text-(--text-strong)">{title}</h3>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-(--text-muted)">{description}</p>
              </div>
              <ArrowDownRight
                aria-hidden="true"
                className="hidden h-5 w-5 text-(--border-strong) transition group-hover:text-(--brand-gold) sm:block"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
