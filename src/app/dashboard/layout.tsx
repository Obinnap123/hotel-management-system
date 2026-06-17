import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { canAccessPath } from "@/lib/auth/permissions";
import { getCurrentSession } from "@/server/auth/session";
import { getHotelSettings } from "@/features/settings/queries";

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

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const settings = await getHotelSettings();
  const visibleNavigationItems = navigationItems.filter((item) =>
    canAccessPath(session.role, item.href),
  );

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-zinc-100 text-zinc-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-zinc-200 bg-white px-4 py-5 xl:block">
        <div className="mb-8 min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            HMS
          </p>
          <h1 className="mt-1 break-words text-lg font-semibold">
            {settings.hotelName}
          </h1>
        </div>

        <nav className="space-y-1">
          {visibleNavigationItems.map((item) => (
            <Link
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 max-w-full overflow-x-hidden xl:pl-64">
        <header className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-zinc-500">Signed in as</p>
              <p className="break-words font-medium">
                {session.fullName} ({session.role})
              </p>
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
                className="whitespace-nowrap rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700"
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
