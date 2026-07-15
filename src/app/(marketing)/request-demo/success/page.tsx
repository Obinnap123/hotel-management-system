import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, MonitorPlay } from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";
import { marketingConfig } from "@/lib/marketing/config";

export const metadata: Metadata = { title: "Demo Request Received | SymplyUp Hotel Suite", description: "Confirmation page for SymplyUp Hotel Suite demo requests." };

export default function RequestDemoSuccessPage() {
  return (
    <div className="bg-background">
      <section className="marketing-container grid min-h-[calc(100vh-8rem)] gap-12 py-16 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-20">
        <div><span className="flex h-12 w-12 items-center justify-center bg-(--accent) text-white"><Check aria-hidden="true" className="h-6 w-6" /></span><p className="marketing-eyebrow mt-7">Request received</p><h1 className="marketing-display mt-4">Thank you. We now have the context for a useful conversation.</h1><p className="marketing-lead mt-6">The SymplyUp team can follow up about your hotel&apos;s requirements. You can also explore the complete guest and staff journey now.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link className={buttonStyles({ className: "group rounded-none", size: "lg" })} href={marketingConfig.demoUrl}>Launch Live Demo<ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link><Link className={buttonStyles({ className: "rounded-none", size: "lg", variant: "secondary" })} href="/">Back to Home</Link></div></div>
        <aside className="border border-(--border) bg-(--brand-footer) p-7 text-white shadow-(--shadow-md) sm:p-9"><MonitorPlay aria-hidden="true" className="h-7 w-7 text-(--brand-gold-soft)" /><h2 className="mt-6 text-2xl font-semibold">What the live demo includes</h2><ol className="mt-7 border-t border-white/14">{[["Guest journey", "Browse room types and create a reservation."], ["Staff access", "Open the secure login and enter the HMS."], ["Hotel operation", "Explore bookings, guests, payments, stays, and reporting."]].map(([title, description], index) => <li className="grid gap-2 border-b border-white/14 py-5 sm:grid-cols-[2rem_0.65fr_1fr]" key={title}><span className="text-xs font-bold text-(--brand-gold-soft)">0{index + 1}</span><h3 className="text-sm font-semibold">{title}</h3><p className="text-sm leading-6 text-white/64">{description}</p></li>)}</ol><p className="mt-6 text-xs leading-5 text-white/52">The demo is a simulated hotel deployment. It shows how the Reservation Website and HMS operate as one suite.</p></aside>
      </section>
    </div>
  );
}
