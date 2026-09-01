import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HotelLogo } from "@/components/branding/HotelLogo";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { canAccessPath } from "@/lib/auth/permissions";
import { getCurrentActiveSession } from "@/server/auth/session";
import { getReservationSiteConfig } from "@/features/settings/queries";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/room-types", label: "Room Types" },
  { href: "/dashboard/rooms", label: "Rooms" },
  { href: "/dashboard/guests", label: "Guests" },
  { href: "/dashboard/bookings", label: "Bookings" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/check-ins", label: "Check-Ins" },
  { href: "/dashboard/check-outs", label: "Check-Outs" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/settings", label: "Settings" },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getReservationSiteConfig();

  return {
    title: {
      absolute: `${config.hotel.name} | HMS`,
    },
    icons: config.branding.faviconUrl
      ? {
          icon: [{ url: config.branding.faviconUrl }],
          shortcut: [{ url: config.branding.faviconUrl }],
        }
      : undefined,
  };
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentActiveSession();

  if (!session) {
    redirect("/login");
  }

  const config = await getReservationSiteConfig();
  const visibleNavigationItems = navigationItems.filter((item) =>
    canAccessPath(session.role, item.href),
  );

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-[var(--app-bg)] text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[var(--border)] bg-white/95 px-4 py-5 shadow-sm xl:block">
        <div className="mb-8 flex min-w-0 flex-col items-center text-center">
          {config.branding.logoUrl ? (
            <HotelLogo
              alt={`${config.hotel.name} logo`}
              className="h-14 w-full max-w-48"
              position="center"
              priority
              sizes="192px"
              url={config.branding.logoUrl}
            />
          ) : (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              HMS
            </p>
          )}
          <h1
            className={`${
              config.branding.logoUrl ? "mt-2 text-base" : "mt-1 text-lg"
            } break-words text-center font-semibold tracking-tight text-slate-950`}
          >
            {config.hotel.name}
          </h1>
        </div>

        <nav className="space-y-1">
          {visibleNavigationItems.map((item) => (
            <Link
              className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 max-w-full overflow-x-hidden xl:pl-64">
        <header className="border-b border-[var(--border)] bg-white/95 px-4 py-4 shadow-sm sm:px-6">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              {config.branding.logoUrl ? (
                <HotelLogo
                  alt={`${config.hotel.name} logo`}
                  className="h-10 w-20 sm:w-28 xl:hidden"
                  priority
                  sizes="(max-width: 639px) 80px, 112px"
                  url={config.branding.logoUrl}
                />
              ) : null}
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Signed in as
                </p>
                <p className="break-words font-medium text-slate-950">
                  {session.fullName} ({session.role})
                </p>
              </div>
            </div>

            <AccountMenu
              email={session.email}
              fullName={session.fullName}
              role={session.role}
            />
          </div>

          <nav className="mt-4 flex max-w-full gap-2 overflow-x-auto xl:hidden">
            {visibleNavigationItems.map((item) => (
              <Link
                className="whitespace-nowrap rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-[var(--border-strong)] hover:bg-slate-50"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="min-w-0 max-w-full overflow-x-hidden px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
