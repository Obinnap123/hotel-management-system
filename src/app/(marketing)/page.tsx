import type { Metadata } from "next";
import { HomeHero } from "@/components/marketing/HomeHero";
import { PlatformHighlights } from "@/components/marketing/PlatformHighlights";
import { ProblemsWeSolve } from "@/components/marketing/ProblemsWeSolve";
import { CoreFeatures } from "@/components/marketing/CoreFeatures";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Benefits } from "@/components/marketing/Benefits";
import { PricingPreview } from "@/components/marketing/PricingPreview";
import { FAQPreview } from "@/components/marketing/FAQPreview";
import { FinalCTA } from "@/components/marketing/FinalCTA";

export const metadata: Metadata = {
  title: "SymplyUp Hotel Suite | Cloud Hotel Management Platform",
  description:
    "SymplyUp Hotel Suite helps hotels manage reservations, guests, payments, check-ins, check-outs, and reporting from one connected platform.",
};

export default function MarketingHomePage() {
  return (
    <>
      <HomeHero />
      <PlatformHighlights />
      <ProblemsWeSolve />
      <CoreFeatures />
      <HowItWorks />
      <Benefits />
      <PricingPreview />
      <FAQPreview />
      <FinalCTA />
    </>
  );
}
