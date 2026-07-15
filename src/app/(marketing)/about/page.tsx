import type { Metadata } from "next";
import { AboutPageContent } from "@/components/marketing/AboutPageContent";

export const metadata: Metadata = {
  title: "About | SymplyUp Hotel Suite",
  description:
    "Learn why SymplyUp Hotel Suite exists and how it helps hotels connect guest reservations with daily operations.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
