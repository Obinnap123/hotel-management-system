"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";
import { marketingConfig, marketingNavLinks } from "@/lib/marketing/config";
import { MobileMarketingMenu } from "./MobileMarketingMenu";

export function MarketingNavbar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-(--border) bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] backdrop-blur-xl">
      <div className="marketing-container flex h-18 items-center justify-between gap-6">
        <Link
          aria-label={`${marketingConfig.companyName} home`}
          className="group inline-flex min-w-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--ring)"
          href="/"
        >
          <span aria-hidden="true" className="h-8 w-1 bg-(--brand-gold)" />
          <span className="min-w-0">
            <span className="block text-base font-bold text-(--text-strong)">
              {marketingConfig.companyName}
            </span>
            <span className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-(--text-muted) sm:block">
              Hotel Suite
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden h-full items-center gap-6 text-sm font-medium lg:flex"
        >
          {marketingNavLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`relative flex h-full items-center border-b-2 pt-0.5 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--ring) ${
                  active
                    ? "border-(--brand-gold) text-(--text-strong)"
                    : "border-transparent text-(--text-muted) hover:text-(--text-strong)"
                }`}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            className="inline-flex h-10 items-center gap-1.5 px-2 text-sm font-semibold text-(--text-muted) transition hover:text-(--text-strong) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--ring)"
            href={marketingConfig.staffLoginUrl}
          >
            Staff Login
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
          <Link
            className={buttonStyles({ shape: "pill", size: "md" })}
            href="/request-demo"
          >
            Request Demo
          </Link>
        </div>

        <MobileMarketingMenu />
      </div>
    </header>
  );
}
