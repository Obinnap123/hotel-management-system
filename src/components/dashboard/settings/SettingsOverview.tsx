import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Clock3,
  Globe2,
  Images,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { SettingsPageHeader } from "./SettingsPageHeader";

type SettingsOverviewProps = {
  currency: string;
  heroImageCount: number;
  hasCustomLogo: boolean;
  hotelName: string;
  websiteTitle: string;
};

export function SettingsOverview({
  currency,
  heroImageCount,
  hasCustomLogo,
  hotelName,
  websiteTitle,
}: SettingsOverviewProps) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-7">
      <SettingsPageHeader
        description="Keep the hotel's identity, operating defaults, and public reservation experience accurate from one place."
        title="Settings"
      />

      <section
        aria-labelledby="settings-sections-heading"
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <h3
            className="text-base font-semibold text-slate-950"
            id="settings-sections-heading"
          >
            Manage your hotel
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Choose an area to review and update. Changes only apply to this hotel.
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          <SettingsLink
            description="Hotel logos, browser icon, colours, typography, and appearance used across the reservation website."
            href="/dashboard/settings/branding"
            icon={Palette}
            meta={
              <span className="inline-flex items-center gap-1.5">
                <Images aria-hidden="true" className="h-3.5 w-3.5" />
                {hasCustomLogo ? "Custom logo configured" : "Hotel-name fallback active"}
              </span>
            }
            title="Branding"
          />
          <SettingsLink
            description="Hotel identity, contact information, currency, and default arrival and departure times."
            href="/dashboard/settings/hotel-profile"
            icon={Building2}
            meta={
              <>
                <span className="inline-flex items-center gap-1.5">
                  <Building2 aria-hidden="true" className="h-3.5 w-3.5" />
                  {hotelName}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
                  {currency}
                </span>
              </>
            }
            title="Hotel profile"
          />
          <SettingsLink
            description="Browser and search details, plus the photography shown in the reservation website hero."
            href="/dashboard/settings/reservation-website"
            icon={Globe2}
            meta={
              <>
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <Globe2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {websiteTitle || "Automatic website title"}
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5">
                  <Images aria-hidden="true" className="h-3.5 w-3.5" />
                  {heroImageCount > 0
                    ? `${heroImageCount} custom hero ${heroImageCount === 1 ? "image" : "images"}`
                    : "Default hero images"}
                </span>
              </>
            }
            title="Reservation website"
          />
        </div>
      </section>

      <p className="max-w-3xl text-sm leading-6 text-slate-500">
        Booking rules, policies, and notifications will appear here as their
        controls are introduced in the next product steps.
      </p>
    </div>
  );
}

function SettingsLink({
  description,
  href,
  icon: Icon,
  meta,
  title,
}: {
  description: string;
  href: string;
  icon: LucideIcon;
  meta: React.ReactNode;
  title: string;
}) {
  return (
    <Link
      className="group grid gap-4 px-5 py-5 transition hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-900 sm:grid-cols-[2.75rem_minmax(0,1fr)_auto] sm:items-start sm:px-6 sm:py-6"
      href={href}
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition group-hover:bg-slate-200">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-base font-semibold text-slate-950">
          {title}
        </span>
        <span className="mt-1 block max-w-2xl text-sm leading-6 text-slate-600">
          {description}
        </span>
        <span className="mt-3 flex min-w-0 flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
          {meta}
        </span>
      </span>
      <ArrowRight
        aria-hidden="true"
        className="hidden h-5 w-5 self-center text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700 sm:block"
      />
    </Link>
  );
}
