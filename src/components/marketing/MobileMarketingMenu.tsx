"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { buttonStyles } from "@/components/ui/button-styles";
import { marketingConfig, marketingNavLinks } from "@/lib/marketing/config";

const drawerTransition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function MobileMarketingMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Dialog.Root onOpenChange={setMenuOpen} open={menuOpen}>
      <Dialog.Trigger asChild>
        <button
          aria-controls="marketing-mobile-navigation"
          aria-expanded={menuOpen}
          aria-label="Open navigation"
          className="inline-flex h-11 w-11 items-center justify-center border border-(--border) bg-(--surface) text-(--text-strong) transition hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--ring) lg:hidden"
          type="button"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {menuOpen ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-60 bg-slate-950/65 backdrop-blur-[2px] lg:hidden"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.aside
                animate={{ opacity: 1, x: 0 }}
                className="marketing-theme fixed inset-y-0 right-0 z-70 flex h-dvh w-[min(24rem,calc(100vw-1.25rem))] max-w-full flex-col overflow-hidden border-l border-(--border) bg-(--surface) text-(--text) shadow-2xl outline-none lg:hidden"
                exit={{ opacity: 0.98, x: "100%" }}
                id="marketing-mobile-navigation"
                initial={{ opacity: 0.98, x: "100%" }}
                transition={drawerTransition}
              >
                <div className="flex h-18 shrink-0 items-center justify-between gap-5 border-b border-(--border) px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span aria-hidden="true" className="h-8 w-1 shrink-0 bg-(--brand-gold)" />
                    <div className="min-w-0">
                      <Dialog.Title className="truncate text-base font-bold text-(--text-strong)">
                        {marketingConfig.companyName}
                      </Dialog.Title>
                      <Dialog.Description
                        className="sr-only"
                      >
                        Navigate the SymplyUp business website or access staff login.
                      </Dialog.Description>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-(--text-muted)">
                        Hotel Suite
                      </p>
                    </div>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      aria-label="Close navigation"
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-(--border) text-(--text-muted) transition hover:border-(--border-strong) hover:text-(--text-strong) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--ring)"
                      type="button"
                    >
                      <X aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav
                  aria-label="Mobile navigation"
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6"
                >
                  <div className="grid border-y border-(--border)">
                    {marketingNavLinks.map((link) => {
                      const active = pathname === link.href;

                      return (
                        <Link
                          aria-current={active ? "page" : undefined}
                          className={`flex min-h-14 items-center justify-between gap-4 border-b border-(--border) py-3 text-base font-semibold transition last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring) ${
                            active
                              ? "text-(--text-strong)"
                              : "text-(--text-muted) hover:text-(--text-strong)"
                          }`}
                          href={link.href}
                          key={link.href}
                          onClick={() => setMenuOpen(false)}
                        >
                          {link.label}
                          {active ? (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-(--brand-gold)" />
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                </nav>

                <div className="shrink-0 border-t border-(--border) bg-(--surface-muted) px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
                  <div className="grid gap-3">
                    <Link
                      className={buttonStyles({
                        className: "w-full",
                        shape: "pill",
                        size: "lg",
                      })}
                      href="/request-demo"
                      onClick={() => setMenuOpen(false)}
                    >
                      Request Demo
                    </Link>
                    <Link
                      className={buttonStyles({
                        className: "w-full",
                        shape: "pill",
                        size: "lg",
                        variant: "secondary",
                      })}
                      href={marketingConfig.staffLoginUrl}
                      onClick={() => setMenuOpen(false)}
                    >
                      Staff Login
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
