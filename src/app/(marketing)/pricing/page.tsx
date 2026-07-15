import type { Metadata } from "next";
import { PricingPageContent } from "@/components/marketing/PricingPageContent";

export const metadata: Metadata = {
  title: "Pricing | SymplyUp Hotel Suite",
  description:
    "Explore tailored SymplyUp Hotel Suite pricing plans for guest houses, growing hotels, and advanced hospitality operations.",
};

export default function PricingPage() {
  return <PricingPageContent />;
}
