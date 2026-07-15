import {
  ArrowRight,
  BookOpen,
  CalendarX2,
  CircleDollarSign,
  MessageCircle,
  SearchX,
  Sheet,
} from "lucide-react";
import { MarketingEyebrow } from "./MarketingPrimitives";

const fragmented = [
  { label: "Reservations in notebooks", icon: BookOpen },
  { label: "Availability in spreadsheets", icon: Sheet },
  { label: "Guest details in messages", icon: MessageCircle },
  { label: "Payment history difficult to trace", icon: CircleDollarSign },
  { label: "Room status unclear to staff", icon: CalendarX2 },
  { label: "Owner visibility arrives too late", icon: SearchX },
];

const connected = [
  "Reservation captured",
  "Room assigned",
  "Guest record available",
  "Payment linked",
  "Stay managed",
  "Activity reported",
];

export function ProblemsWeSolve() {
  return (
    <section className="marketing-section bg-background">
      <div className="marketing-container">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div className="max-w-2xl">
            <MarketingEyebrow>Problems we solve</MarketingEyebrow>
            <h2 className="marketing-heading mt-5">
              Disconnected hotel operations create avoidable pressure.
            </h2>
          </div>
          <p className="marketing-lead max-w-2xl lg:justify-self-end">
            Many hotels coordinate reservations, rooms, guests, and payments
            across tools that never agree. SymplyUp replaces that daily
            uncertainty with one operational record.
          </p>
        </div>

        <div className="mt-14 grid border border-(--border) lg:grid-cols-[1fr_auto_1fr]">
          <div className="bg-(--surface-muted) p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-(--text-muted)">
              Before: fragmented work
            </p>
            <ul className="mt-6 grid gap-0 divide-y divide-(--border)">
              {fragmented.map(({ icon: Icon, label }) => (
                <li className="flex items-center gap-3 py-4 text-sm text-(--text-muted)" key={label}>
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden items-center bg-(--background) px-5 lg:flex" aria-hidden="true">
            <ArrowRight className="h-5 w-5 text-(--brand-gold)" />
          </div>

          <div className="bg-(--brand-footer) p-6 text-white sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-(--brand-gold-soft)">
              After: one connected record
            </p>
            <ol className="mt-6">
              {connected.map((item, index) => (
                <li className="relative flex gap-4 pb-5 last:pb-0" key={item}>
                  {index < connected.length - 1 ? (
                    <span aria-hidden="true" className="absolute left-[0.68rem] top-6 h-[calc(100%-0.25rem)] w-px bg-white/16" />
                  ) : null}
                  <span className="relative mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-(--brand-gold) bg-(--brand-footer) text-[0.6rem] font-bold text-(--brand-gold-soft)">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-white/78">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
