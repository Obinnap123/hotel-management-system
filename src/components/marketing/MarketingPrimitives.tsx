import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";

export function MarketingEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="marketing-eyebrow">
      <span aria-hidden="true" className="marketing-eyebrow-line" />
      {children}
    </p>
  );
}

export function MarketingPageHero({
  description,
  eyebrow,
  primaryLabel = "Request Demo",
  primaryHref = "/request-demo",
  secondaryLabel,
  secondaryHref,
  title,
  visual,
}: {
  description: string;
  eyebrow: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  title: string;
  visual?: React.ReactNode;
}) {
  return (
    <section className="marketing-page-hero">
      <div className="marketing-container grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.78fr)] lg:items-center lg:py-24">
        <div className="max-w-3xl">
          <MarketingEyebrow>{eyebrow}</MarketingEyebrow>
          <h1 className="marketing-display mt-6">{title}</h1>
          <p className="marketing-lead mt-6 max-w-2xl">{description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className={buttonStyles({ shape: "pill", size: "lg" })}
              href={primaryHref}
            >
              {primaryLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            {secondaryHref && secondaryLabel ? (
              <Link
                className={buttonStyles({
                  shape: "pill",
                  size: "lg",
                  variant: "secondary",
                })}
                href={secondaryHref}
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
        {visual ? <div className="min-w-0">{visual}</div> : null}
      </div>
    </section>
  );
}

export function MarketingFinalBand({
  description,
  eyebrow,
  secondaryHref,
  secondaryLabel,
  title,
}: {
  description: string;
  eyebrow: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  title: string;
}) {
  return (
    <section className="marketing-final-band">
      <div className="marketing-container grid gap-8 py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:py-20">
        <div className="max-w-3xl">
          <MarketingEyebrow>{eyebrow}</MarketingEyebrow>
          <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/68">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Link
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#101725] transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25"
            href="/request-demo"
          >
            Request Demo
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/18 bg-white/6 px-6 text-sm font-semibold text-white transition hover:bg-white/11 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
              href={secondaryHref}
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
