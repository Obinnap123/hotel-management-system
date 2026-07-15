import type { Metadata } from "next";
import { SolutionsPageContent } from "@/components/marketing/SolutionsPageContent";

export const metadata: Metadata = {
  title: "Solutions | SymplyUp Hotel Suite",
  description:
    "See how SymplyUp Hotel Suite supports guest houses, boutique hotels, growing hotels, and hospitality teams with connected hotel operations.",
};

export default function SolutionsPage() {
  return <SolutionsPageContent />;
}
