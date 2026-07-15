import { ArrowRight, CircleHelp, ClipboardCheck, LogIn, MessageSquareText, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { marketingConfig } from "@/lib/marketing/config";
import { MarketingFinalBand, MarketingPageHero } from "./MarketingPrimitives";

const paths: Array<{ title: string; description: string; action: string; href: string; icon: LucideIcon }> = [
  { title: "Sales and product demo", description: "Tell us about your hotel and receive a guided walkthrough of the complete platform.", action: "Request a demo", href: "/request-demo", icon: MessageSquareText },
  { title: "Product questions", description: "Find clear answers about reservations, operations, staff access, deployment, and pricing.", action: "Read the FAQ", href: "/faq", icon: CircleHelp },
  { title: "Plans and deployment", description: "Understand the plan structure and what shapes a tailored SymplyUp quote.", action: "See pricing", href: "/pricing", icon: SlidersHorizontal },
  { title: "Existing hotel staff", description: "Staff of an existing hotel deployment can continue to the secure HMS login.", action: "Staff login", href: marketingConfig.staffLoginUrl, icon: LogIn },
];

const preparation = ["Hotel name and location", "Approximate number of rooms", "How reservations are handled today", "The operational problems you want to solve", "Your rollout goals or preferred timeline"];

export function ContactPageContent() {
  return (
    <>
      <MarketingPageHero
        description="Choose the route that matches your question. Sales conversations begin with a demo request so our team receives the hotel context needed to make the discussion useful."
        eyebrow="Contact"
        secondaryHref="/pricing"
        secondaryLabel="See Pricing"
        title="Let’s talk about modernizing your hotel operations."
        visual={<ContactVisual />}
      />

      <section className="marketing-section border-y border-(--border) bg-(--surface-muted)">
        <div className="marketing-container grid gap-12 lg:grid-cols-[0.58fr_1.42fr] lg:gap-20">
          <div><p className="marketing-eyebrow">Choose a route</p><h2 className="marketing-heading mt-4">Reach the right place without unnecessary steps.</h2><p className="marketing-lead mt-5">We do not publish invented contact details or duplicate the sales form. Each path below leads to the source designed for that question.</p></div>
          <div className="border-t border-(--border)">{paths.map((path) => <ContactPath key={path.title} {...path} />)}</div>
        </div>
      </section>

      <section className="marketing-section bg-background">
        <div className="marketing-container grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div><p className="marketing-eyebrow">Prepare for the conversation</p><h2 className="marketing-heading mt-4">A few practical details are enough to begin.</h2><p className="marketing-lead mt-5">You do not need a formal requirements document. We need enough context to understand your operation.</p></div>
          <ol className="border-t border-(--border)">{preparation.map((item, index) => <li className="grid grid-cols-[3rem_1fr] border-b border-(--border) py-5 text-sm font-medium text-(--text-strong)" key={item}><span className="font-bold text-(--brand-gold)">0{index + 1}</span>{item}</li>)}</ol>
        </div>
      </section>

      <section className="border-y border-(--border) bg-(--brand-footer) text-white">
        <div className="marketing-container grid gap-10 py-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 lg:py-20">
          <div><p className="marketing-eyebrow text-(--brand-gold-soft)">What happens next</p><h2 className="mt-4 text-3xl font-semibold">A direct path from your request to a useful walkthrough.</h2></div>
          <ol className="border-t border-white/14">{[["Submit the request", "Share the basic hotel and contact details."], ["We review the context", "The team considers your size, workflow, and priorities."], ["Walk through the product", "See the Reservation Website and HMS operate together."], ["Discuss rollout", "Clarify plan, onboarding, branding, and deployment requirements."]].map(([title, description], index) => <li className="grid gap-3 border-b border-white/14 py-5 sm:grid-cols-[3rem_0.7fr_1fr]" key={title}><span className="text-sm font-bold text-(--brand-gold-soft)">0{index + 1}</span><h3 className="font-semibold">{title}</h3><p className="text-sm leading-7 text-white/64">{description}</p></li>)}</ol>
        </div>
      </section>

      <MarketingFinalBand description="Share the hotel context once, then move into a focused product and deployment conversation." eyebrow="Start the conversation" secondaryHref="/features" secondaryLabel="See Features" title="See how SymplyUp can fit the way your hotel operates." />
    </>
  );
}

function ContactVisual() {
  return <div className="border border-(--border) bg-(--surface) p-6 shadow-(--shadow-md)"><ClipboardCheck aria-hidden="true" className="h-6 w-6 text-(--brand-gold)" /><p className="mt-5 text-lg font-semibold text-(--text-strong)">Begin with the hotel, not a generic pitch.</p><p className="mt-3 text-sm leading-7 text-(--text-muted)">Your room count, current process, and priorities shape the conversation.</p><Link className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-(--text-strong)" href="/request-demo">Request a guided demo <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></div>;
}

function ContactPath({ action, description, href, icon: Icon, title }: { action: string; description: string; href: string; icon: LucideIcon; title: string }) {
  return <article className="group grid gap-4 border-b border-(--border) py-7 sm:grid-cols-[2.5rem_0.7fr_1fr_auto] sm:items-start"><Icon aria-hidden="true" className="h-5 w-5 text-(--text-muted)" /><h3 className="font-semibold text-(--text-strong)">{title}</h3><p className="text-sm leading-7 text-(--text-muted)">{description}</p><Link className="inline-flex items-center gap-2 text-sm font-semibold text-(--text-strong) group-hover:text-(--brand-gold)" href={href}>{action}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></article>;
}
