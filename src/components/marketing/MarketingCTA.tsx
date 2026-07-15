import Link from "next/link";
import { buttonStyles } from "@/components/ui/button-styles";

type MarketingCTAProps = {
  className?: string;
  tone?: "default" | "inverted";
};

export function MarketingCTA({
  className = "",
  tone = "default",
}: MarketingCTAProps = {}) {
  const isInverted = tone === "inverted";

  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <Link
        className={
          isInverted
            ? "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white bg-white px-6 text-sm font-semibold text-[#101725] shadow-sm transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
            : buttonStyles({ shape: "pill", size: "lg" })
        }
        href="/request-demo"
      >
        Request Demo
      </Link>
      <Link
        className={
          isInverted
            ? "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
            : buttonStyles({
                shape: "pill",
                size: "lg",
                variant: "secondary",
              })
        }
        href="/features"
      >
        See Features
      </Link>
    </div>
  );
}
