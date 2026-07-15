import type { Metadata } from "next";
import { FAQPageContent } from "@/components/marketing/FAQPageContent";

export const metadata: Metadata = {
  title: "FAQ | SymplyUp Hotel Suite",
  description:
    "Answers to common questions about SymplyUp Hotel Suite, including reservations, HMS workflows, staff access, payments, pricing, and deployment.",
};

export default function FAQPage() {
  return <FAQPageContent />;
}
