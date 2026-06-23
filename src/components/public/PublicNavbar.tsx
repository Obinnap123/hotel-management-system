"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/book", label: "Reserve" },
  { href: "/login", label: "Staff Login" },
];

export function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f7f3ed]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-5 py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            className="text-lg font-semibold tracking-tight text-[#172033]"
            href="/"
            onClick={() => setMenuOpen(false)}
          >
          Obinna&apos;s Hotel
          </Link>

          <nav className="hidden items-center gap-2 text-sm font-medium text-[#415064] md:flex">
            {navLinks.map((link) => (
              <Link
                className={
                  link.href === "/book"
                    ? "rounded-full bg-[#172033] px-4 py-2 text-white transition hover:bg-[#24314a]"
                    : "rounded-full px-3 py-2 transition hover:bg-black/5 hover:text-[#172033]"
                }
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#172033] shadow-sm transition hover:bg-[#f2eee7] md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>

        {menuOpen ? (
          <nav className="mt-4 grid gap-2 rounded-2xl border border-black/10 bg-white p-2 text-sm font-medium text-[#415064] shadow-[0_20px_50px_rgba(23,32,51,0.12)] md:hidden">
            {navLinks.map((link) => (
              <Link
                className={
                  link.href === "/book"
                    ? "rounded-xl bg-[#172033] px-4 py-3 text-white"
                    : "rounded-xl px-4 py-3 transition hover:bg-[#f7f3ed] hover:text-[#172033]"
                }
                href={link.href}
                key={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
