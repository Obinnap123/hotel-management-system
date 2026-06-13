import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/login/actions";
import { canAccessPath } from "@/lib/auth/permissions";
import { getCurrentSession } from "@/server/auth/session";

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

  const visibleNavigationItems = navigationItems.filter((item) =>
    canAccessPath(session.role, item.href),
  );

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-zinc-200 bg-white px-4 py-5 lg:block">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            HMS
          </p>
          <h1 className="mt-1 text-lg font-semibold">Hotel Management</h1>
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

      <div className="lg:pl-64">
        <header className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-zinc-500">Signed in as</p>
              <p className="font-medium">
                {session.fullName} ({session.role})
              </p>
            </div>

            <form action={logoutAction}>
              <button
                className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
                type="submit"
              >
                Sign out
              </button>
            </form>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
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

        <main className="px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
