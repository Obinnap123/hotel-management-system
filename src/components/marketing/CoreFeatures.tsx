import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BedDouble,
  CalendarCheck,
  CreditCard,
  Globe2,
  KeyRound,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MarketingEyebrow } from "./MarketingPrimitives";

const supportingFeatures: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  { title: "Booking Management", description: "Control dates, rooms, lifecycle status, and cancellations.", icon: CalendarCheck },
  { title: "Room Management", description: "Keep room types, inventory, prices, and availability organized.", icon: BedDouble },
  { title: "Guest Management", description: "Maintain reusable guest records that staff can find quickly.", icon: UsersRound },
  { title: "Payment Tracking", description: "Connect recorded payments to the booking they belong to.", icon: CreditCard },
  { title: "Check-In / Check-Out", description: "Move active stays through arrival and departure with accurate room status.", icon: KeyRound },
  { title: "Reports and Roles", description: "Give owners visibility and staff only the access their work requires.", icon: BarChart3 },
];

export function CoreFeatures() {
  return (
    <section className="marketing-section border-y border-(--border) bg-(--surface-muted)">
      <div className="marketing-container">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <MarketingEyebrow>Core platform</MarketingEyebrow>
            <h2 className="marketing-heading mt-5">
              Two experiences. One hotel operating system.
            </h2>
          </div>
          <p className="marketing-lead max-w-2xl lg:justify-self-end">
            Guests receive a focused reservation journey. Staff receive the
            operational tools needed to turn that reservation into a well-run stay.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <article className="relative overflow-hidden border border-(--border) bg-(--surface) p-7 sm:p-9">
            <div className="absolute right-0 top-0 h-1 w-24 bg-(--brand-gold)" />
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--brand-gold)">
                  Guest experience
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-(--text-strong)">
                  Reservation Website
                </h3>
              </div>
              <Globe2 aria-hidden="true" className="h-6 w-6 shrink-0 text-(--text-muted)" />
            </div>
            <p className="mt-5 max-w-lg text-sm leading-7 text-(--text-muted)">
              A hotel-branded public experience where guests can review room
              types, check availability, and submit reservations without an account.
            </p>
            <ul className="mt-8 grid gap-3 border-t border-(--border) pt-6 text-sm font-medium text-(--text-strong) sm:grid-cols-2">
              <li>Room discovery</li>
              <li>Availability search</li>
              <li>Direct reservations</li>
              <li>Booking confirmation</li>
            </ul>
          </article>

          <article className="relative overflow-hidden border border-white/10 bg-(--brand-footer) p-7 text-white sm:p-9">
            <div className="absolute right-0 top-0 h-1 w-24 bg-(--brand-gold)" />
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--brand-gold-soft)">
                  Staff operations
                </p>
                <h3 className="mt-4 text-2xl font-semibold">
                  Hotel Management System
                </h3>
              </div>
              <ShieldCheck aria-hidden="true" className="h-6 w-6 shrink-0 text-white/55" />
            </div>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/62">
              A secure internal workspace for bookings, rooms, guests, payments,
              arrivals, departures, staff roles, and operational reporting.
            </p>
            <ul className="mt-8 grid gap-3 border-t border-white/12 pt-6 text-sm font-medium text-white/82 sm:grid-cols-2">
              <li>Front desk workflows</li>
              <li>Room status control</li>
              <li>Role-based access</li>
              <li>Owner visibility</li>
            </ul>
          </article>
        </div>

        <div className="mt-5 grid border-l border-t border-(--border) sm:grid-cols-2 lg:grid-cols-3">
          {supportingFeatures.map(({ description, icon: Icon, title }, index) => (
            <article
              className="group border-b border-r border-(--border) bg-(--surface) p-5 transition-colors hover:bg-(--surface-soft)"
              key={title}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-(--brand-gold)">0{index + 1}</span>
                <Icon aria-hidden="true" className="h-4 w-4 text-(--text-muted)" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-(--text-strong)">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-(--text-muted)">{description}</p>
            </article>
          ))}
        </div>

        <Link
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-(--text-strong) transition hover:text-(--brand-gold) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--ring)"
          href="/features"
        >
          Explore every capability
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
