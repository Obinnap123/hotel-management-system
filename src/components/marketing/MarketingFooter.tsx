import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  marketingConfig,
  marketingFooterGroups,
} from "@/lib/marketing/config";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-(--brand-footer) text-white">
      <div className="marketing-container grid gap-12 py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.35fr)] lg:py-18">
        <div className="max-w-lg">
          <Link
            className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
            href="/"
          >
            <span aria-hidden="true" className="h-9 w-1 bg-(--brand-gold)" />
            <span>
              <span className="block text-xl font-bold">
                {marketingConfig.companyName}
              </span>
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/48">
                Hotel Suite
              </span>
            </span>
          </Link>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/62">
            One connected platform for direct reservations, daily hotel
            operations, and clearer owner visibility.
          </p>
          <Link
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-(--brand-gold-soft) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
            href="/request-demo"
          >
            Request a guided demo
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-9 sm:grid-cols-3">
          {marketingFooterGroups.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--brand-gold-soft)">
                {group.title}
              </p>
              <nav
                aria-label={`${group.title} links`}
                className="mt-5 grid gap-3.5 text-sm text-white/58"
              >
                {group.links.map((link) => (
                  <Link
                    className="w-fit transition hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="marketing-container flex flex-col gap-3 py-6 text-xs text-white/42 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {marketingConfig.companyName}. All
            rights reserved.
          </p>
          <p>Designed for modern hotel operations.</p>
        </div>
      </div>
    </footer>
  );
}
