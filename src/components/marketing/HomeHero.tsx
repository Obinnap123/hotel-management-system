"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BedDouble,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  Globe2,
  KeyRound,
  UsersRound,
} from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";
import { marketingConfig } from "@/lib/marketing/config";
import { MarketingEyebrow } from "./MarketingPrimitives";

const operationalModules = [
  { label: "Bookings", icon: CalendarCheck },
  { label: "Rooms", icon: BedDouble },
  { label: "Guests", icon: UsersRound },
  { label: "Payments", icon: CreditCard },
  { label: "Stay", icon: KeyRound },
  { label: "Reports", icon: BarChart3 },
];

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-(--border) bg-background">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:72px_72px] opacity-55 [mask-image:linear-gradient(to_bottom,black,transparent_86%)]"
      />
      <div className="marketing-container grid min-h-[calc(100svh-4.5rem)] gap-14 py-16 lg:grid-cols-[minmax(0,0.96fr)_minmax(30rem,1.04fr)] lg:items-center lg:py-20">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <MarketingEyebrow>Cloud hotel operations platform</MarketingEyebrow>
          <h1 className="marketing-display mt-7 max-w-4xl">
            Run reservations and hotel operations as one connected system.
          </h1>
          <p className="marketing-lead mt-7 max-w-2xl">
            {marketingConfig.productName} gives hotels a branded Reservation
            Website and a practical Hotel Management System that work together
            from the first booking to checkout.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              className={buttonStyles({ shape: "pill", size: "lg" })}
              href="/request-demo"
            >
              Request Demo
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              className={buttonStyles({
                shape: "pill",
                size: "lg",
                variant: "secondary",
              })}
              href="/features"
            >
              Explore the platform
            </Link>
          </div>

          <ul className="mt-10 grid gap-3 border-t border-(--border) pt-6 text-sm text-(--text-muted) sm:grid-cols-3">
            {["Reservation Website included", "Role-based staff access", "Cloud hosted"].map(
              (item) => (
                <li className="flex items-start gap-2.5" key={item}>
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-(--accent)"
                  />
                  <span>{item}</span>
                </li>
              ),
            )}
          </ul>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="relative min-w-0"
          initial={{ opacity: 0, x: 20 }}
          transition={{ delay: 0.08, duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="overflow-hidden border border-white/10 bg-(--brand-footer) text-white shadow-[0_30px_80px_rgba(15,23,42,0.2)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-(--brand-gold-soft)">
                  SymplyUp ecosystem
                </p>
                <p className="mt-1 text-sm text-white/55">One source of truth</p>
              </div>
              <span className="flex items-center gap-2 text-xs font-semibold text-white/62">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Connected
              </span>
            </div>

            <div className="p-5 sm:p-7">
              <div className="grid gap-3 sm:grid-cols-[0.72fr_auto_1fr] sm:items-stretch">
                <div className="border border-white/12 bg-white/6 p-5">
                  <Globe2 aria-hidden="true" className="h-5 w-5 text-(--brand-gold-soft)" />
                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.13em] text-white/48">
                    Guest-facing
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">Reservation Website</h2>
                  <p className="mt-2 text-sm leading-6 text-white/58">
                    Room discovery and direct reservation capture.
                  </p>
                </div>

                <div className="hidden items-center sm:flex" aria-hidden="true">
                  <div className="relative h-px w-8 bg-(--brand-gold)">
                    <span className="absolute -right-1 -top-1 h-2 w-2 rotate-45 border-r border-t border-(--brand-gold)" />
                  </div>
                </div>

                <div className="border border-(--brand-gold) bg-white/9 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <CalendarCheck aria-hidden="true" className="h-5 w-5 text-(--brand-gold-soft)" />
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-emerald-300">
                      Live operations
                    </span>
                  </div>
                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.13em] text-white/48">
                    Staff-facing
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">Hotel Management System</h2>
                  <p className="mt-2 text-sm leading-6 text-white/58">
                    Every reservation becomes operational work.
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/42">
                  The connected hotel workflow
                </p>
                <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden bg-white/10 sm:grid-cols-3">
                  {operationalModules.map(({ icon: Icon, label }, index) => (
                    <div
                      className="flex items-center gap-3 bg-[#101725] px-4 py-4"
                      key={label}
                    >
                      <span className="text-xs font-semibold text-(--brand-gold-soft)">
                        0{index + 1}
                      </span>
                      <Icon aria-hidden="true" className="h-4 w-4 text-white/48" />
                      <span className="text-sm font-medium text-white/76">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
