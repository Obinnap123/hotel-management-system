import type { Metadata } from "next";
import { FeaturesPageContent } from "@/components/marketing/FeaturesPageContent";

export const metadata: Metadata = {
  title: "Features | SymplyUp Hotel Suite",
  description:
    "Explore SymplyUp Hotel Suite features for reservations, bookings, rooms, guests, payments, check-ins, check-outs, staff roles, and hotel reporting.",
};

export default function FeaturesPage() {
  return <FeaturesPageContent />;
}
