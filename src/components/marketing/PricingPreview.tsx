import Link from "next/link";
import { Check } from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";
import { MarketingEyebrow } from "./MarketingPrimitives";

const plans = [
  {
    name: "Starter",
    label: "For smaller properties",
    description: "A clear operational foundation for guest houses and small hotels moving beyond manual tracking.",
    features: ["Reservation Website", "Rooms, guests, and bookings", "Payment tracking", "Staff login"],
  },
  {
    name: "Professional",
    label: "For growing hotels",
    description: "Connected front desk workflows and stronger visibility for hotels managing more activity and staff.",
    features: ["Everything in Starter", "Check-in and check-out", "Reports dashboard", "Staff roles", "White-label website"],
    recommended: true,
  },
  {
    name: "Enterprise",
    label: "For advanced operations",
    description: "More onboarding, deployment, and support for larger hotels and hospitality teams.",
    features: ["Everything in Professional", "Advanced deployment support", "Custom onboarding", "Priority support"],
  },
];

export function PricingPreview() {
  return (
    <section className="marketing-section bg-background">
      <div className="marketing-container">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div className="max-w-3xl">
            <MarketingEyebrow>Plans</MarketingEyebrow>
            <h2 className="marketing-heading mt-5">
              Start with the operating model that fits your hotel.
            </h2>
          </div>
          <div className="border-l-2 border-(--brand-gold) pl-5">
            <p className="text-sm leading-7 text-(--text-muted)">
              Pricing is tailored to room count, workflow, branding, onboarding,
              and deployment needs. A demo helps us recommend the right plan.
            </p>
          </div>
        </div>

        <div className="mt-14 grid border border-(--border) lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              className={`relative flex flex-col border-b border-(--border) p-6 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0 sm:p-8 ${
                plan.recommended ? "bg-(--surface-muted)" : "bg-(--surface)"
              }`}
              key={plan.name}
            >
              {plan.recommended ? (
                <span className="absolute right-0 top-0 bg-(--brand-solid) px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-(--brand-solid-text)">
                  Recommended
                </span>
              ) : null}
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--brand-gold)">
                {plan.label}
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-(--text-strong)">
                {plan.name}
              </h3>
              <p className="mt-4 min-h-21 text-sm leading-7 text-(--text-muted)">
                {plan.description}
              </p>
              <div className="my-6 border-t border-(--border)" />
              <ul className="grid gap-3 text-sm text-(--text-muted)">
                {plan.features.map((feature) => (
                  <li className="flex gap-3" key={feature}>
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-(--accent)" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                className={buttonStyles({
                  className: "mt-8 w-full",
                  shape: "pill",
                  size: "lg",
                  variant: plan.recommended ? "primary" : "secondary",
                })}
                href="/request-demo"
              >
                Request Demo
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-7 flex justify-end">
          <Link
            className="text-sm font-semibold text-(--text-strong) underline decoration-(--border-strong) underline-offset-4 transition hover:decoration-(--brand-gold) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--ring)"
            href="/pricing"
          >
            Compare plans in detail
          </Link>
        </div>
      </div>
    </section>
  );
}
