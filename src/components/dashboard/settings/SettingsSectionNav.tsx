import Link from "next/link";

const sections = [
  { href: "/dashboard/settings/hotel-profile", label: "Hotel profile" },
  { href: "/dashboard/settings/branding", label: "Branding" },
  {
    href: "/dashboard/settings/reservation-website",
    label: "Reservation website",
  },
] as const;

type SettingsSectionNavProps = {
  active: (typeof sections)[number]["href"];
};

export function SettingsSectionNav({ active }: SettingsSectionNavProps) {
  return (
    <nav aria-label="Settings sections" className="border-b border-slate-200">
      <div className="flex max-w-full gap-6 overflow-x-auto">
        {sections.map((section) => {
          const isActive = section.href === active;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`relative inline-flex min-h-11 shrink-0 items-center text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${
                isActive
                  ? "text-slate-950 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-slate-950"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              href={section.href}
              key={section.href}
            >
              {section.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
