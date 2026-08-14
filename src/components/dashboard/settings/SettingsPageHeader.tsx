import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type SettingsPageHeaderProps = {
  description: string;
  title: string;
  showBackLink?: boolean;
};

export function SettingsPageHeader({
  description,
  title,
  showBackLink = false,
}: SettingsPageHeaderProps) {
  return (
    <header className="max-w-3xl">
      {showBackLink ? (
        <Link
          className="mb-4 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          href="/dashboard/settings"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          All settings
        </Link>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.75rem]">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
        {description}
      </p>
    </header>
  );
}
