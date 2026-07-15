import type { Metadata } from "next";
import { ContactPageContent } from "@/components/marketing/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact | SymplyUp Hotel Suite",
  description:
    "Contact SymplyUp to discuss hotel management, reservations, pricing, deployment, or a guided product demo.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
