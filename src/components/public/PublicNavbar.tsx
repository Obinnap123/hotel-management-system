"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HotelLogo } from "@/components/branding/HotelLogo";
import { publicReservationPath } from "@/lib/public/routes";

const navLinks = [
  { href: publicReservationPath("/"), label: "Home" },
  { href: publicReservationPath("/rooms"), label: "Rooms & suites" },
  { href: publicReservationPath("/#about"), label: "Our hotel" },
];

export function PublicNavbar({
  hotelName,
  logoUrl,
}: {
  hotelName: string;
  logoUrl: string | null;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--reservation-primary)] text-[var(--reservation-on-primary)]">
      <div className="reservation-container flex h-[4.75rem] items-center justify-between gap-5">
        <Link className="group flex min-w-0 items-center gap-3" href={publicReservationPath("/")} onClick={() => setMenuOpen(false)}>
          {logoUrl ? (
            <HotelLogo
              alt={`${hotelName} logo`}
              className="h-12 w-24 max-w-[42vw] sm:h-[3.75rem] sm:w-40"
              priority
              sizes="(max-width: 639px) 96px, 160px"
              url={logoUrl}
            />
          ) : (
            <>
              <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center border border-[var(--reservation-accent-on-primary)]/60 font-serif text-lg text-[var(--reservation-accent-on-primary)]">
                {hotelName.trim().charAt(0).toUpperCase() || "H"}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-serif text-lg leading-none tracking-[-0.02em] sm:text-xl">{hotelName}</span>
                <span className="mt-1 hidden text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/55 sm:block">A considered place to stay</span>
              </span>
            </>
          )}
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const active = link.href === pathname || (link.href.includes("/rooms") && pathname.startsWith(publicReservationPath("/rooms")));
            return <Link aria-current={active ? "page" : undefined} className={`border-b py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition ${active ? "border-[var(--reservation-accent-on-primary)] text-white" : "border-transparent text-white/68 hover:text-white"}`} href={link.href} key={link.href}>{link.label}</Link>;
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link className="text-xs text-white/55 transition hover:text-white" href="/login">Staff</Link>
          <Link className="inline-flex h-10 items-center gap-2 bg-[var(--reservation-accent)] px-5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--reservation-on-accent)] transition hover:bg-[var(--reservation-accent-hover)]" href={publicReservationPath("/book")}>Reserve <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></Link>
        </div>

        <button aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} className="inline-grid h-11 w-11 place-items-center border border-white/20 text-white lg:hidden" onClick={() => setMenuOpen((open) => !open)} type="button">
          {menuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav animate={{ opacity: 1, height: "auto" }} aria-label="Mobile navigation" className="overflow-hidden border-t border-white/10 bg-[var(--reservation-primary)] lg:hidden" exit={{ opacity: 0, height: 0 }} initial={{ opacity: 0, height: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}>
            <div className="reservation-container grid py-4">
              {navLinks.map((link) => <Link className="border-b border-white/10 py-4 text-sm font-medium text-white/82" href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}
              <Link className="mt-4 inline-flex h-12 items-center justify-center bg-[var(--reservation-accent)] text-sm font-semibold text-[var(--reservation-on-accent)]" href={publicReservationPath("/book")} onClick={() => setMenuOpen(false)}>Reserve your stay</Link>
              <Link className="py-4 text-center text-xs text-white/55" href="/login" onClick={() => setMenuOpen(false)}>Staff login</Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
