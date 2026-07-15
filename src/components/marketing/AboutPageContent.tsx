import { Building2, Check, Eye, Link2, MonitorSmartphone, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { marketingConfig } from "@/lib/marketing/config";
import { MarketingFinalBand, MarketingPageHero } from "./MarketingPrimitives";
import { SectionHeader } from "./SectionHeader";

const beliefs: Array<{ title: string; description: string; icon: LucideIcon }> = [
  { title: "Operations should stay connected", description: "A reservation should not become a new manual record at every step of the guest stay.", icon: Link2 },
  { title: "Staff software should feel understandable", description: "Reception teams need focused workflows that support the job in front of them, not unnecessary complexity.", icon: UsersRound },
  { title: "Guests deserve a direct path to reserve", description: "A hotel-branded reservation experience should lead naturally into the hotel's operating system.", icon: MonitorSmartphone },
  { title: "Owners need visibility they can trust", description: "Room activity, arrivals, departures, and recorded revenue should be visible without chasing several sources.", icon: Eye },
];

const audiences = ["Guest houses replacing paper records", "Boutique hotels improving direct reservations", "Growing hotels coordinating front desk work", "Hospitality teams preparing for a stronger operating structure"];

export function AboutPageContent() {
  return (
    <>
      <MarketingPageHero
        description={`${marketingConfig.companyName} builds practical cloud software that connects how guests reserve with how hotel teams manage the stay.`}
        eyebrow="About SymplyUp"
        secondaryHref="/contact"
        secondaryLabel="Contact Us"
        title="Building modern hotel operations software for serious hospitality teams."
        visual={<AboutVisual />}
      />

      <section className="marketing-section border-y border-(--border) bg-(--surface-muted)">
        <div className="marketing-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div><p className="marketing-eyebrow">Why we exist</p><h2 className="marketing-heading mt-4">Hotels should not have to run modern operations through disconnected records.</h2></div>
          <div className="space-y-6 text-base leading-8 text-(--text-muted)">
            <p>Many hotel teams still reconcile reservations from calls and messages, guest details from notebooks, room status from memory, and payment history from separate files.</p>
            <p>The problem is not simply that these tools are old. It is that each disconnected record makes the next staff decision slower and less reliable.</p>
            <p className="border-l-2 border-(--brand-gold) pl-5 font-semibold text-(--text-strong)">{marketingConfig.productName} exists to give the guest journey and the hotel operation one shared source of truth.</p>
          </div>
        </div>
      </section>

      <section className="marketing-section bg-background">
        <div className="marketing-container">
          <SectionHeader description="These principles guide both the product and the way we introduce technology into daily hotel work." eyebrow="What we believe" title="Good hotel software should reduce uncertainty." />
          <div className="mt-12 border-t border-(--border)">{beliefs.map((belief, index) => <BeliefRow index={index} key={belief.title} {...belief} />)}</div>
        </div>
      </section>

      <section className="border-y border-(--border) bg-(--brand-footer) text-white">
        <div className="marketing-container grid gap-12 py-16 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-20 lg:py-20">
          <div><p className="marketing-eyebrow text-(--brand-gold-soft)">One complete suite</p><h2 className="mt-4 text-3xl font-semibold sm:text-4xl">The public website and the hotel operation belong together.</h2><p className="mt-5 text-base leading-8 text-white/66">SymplyUp combines direct reservation capture with the tools staff need to carry that booking through payment, arrival, stay, departure, and reporting.</p></div>
          <div className="grid border-l border-t border-white/14 sm:grid-cols-2">{["Reservation Website", "Bookings and rooms", "Guests and payments", "Check-in and check-out", "Staff roles", "Dashboard and reports"].map((item, index) => <div className="border-b border-r border-white/14 p-5" key={item}><span className="text-xs font-bold text-(--brand-gold-soft)">0{index + 1}</span><p className="mt-3 text-sm font-semibold">{item}</p></div>)}</div>
        </div>
      </section>

      <section className="marketing-section bg-(--surface-muted)">
        <div className="marketing-container grid gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20">
          <div><p className="marketing-eyebrow">Who we build for</p><h2 className="marketing-heading mt-4">Hospitality teams ready for a clearer way to operate.</h2></div>
          <ul className="border-t border-(--border)">{audiences.map((audience) => <li className="flex gap-4 border-b border-(--border) py-5 text-sm font-medium text-(--text-strong)" key={audience}><Check aria-hidden="true" className="h-5 w-5 shrink-0 text-(--accent)" />{audience}</li>)}</ul>
        </div>
      </section>

      <MarketingFinalBand description="Walk through the complete guest and staff journey with your own hotel workflows in mind." eyebrow="See the thinking in practice" secondaryHref="/contact" secondaryLabel="Contact Us" title={`Explore what ${marketingConfig.productName} could change for your team.`} />
    </>
  );
}

function AboutVisual() {
  return <div className="border border-(--border) bg-(--surface) p-6 shadow-(--shadow-md)"><div className="flex items-center gap-4 border-b border-(--border) pb-5"><span className="flex h-10 w-10 items-center justify-center bg-(--brand-solid) text-(--brand-solid-text)"><Building2 aria-hidden="true" className="h-5 w-5" /></span><div><p className="text-xs text-(--text-muted)">Company</p><p className="font-semibold text-(--text-strong)">{marketingConfig.companyName}</p></div></div><p className="mt-6 text-sm leading-7 text-(--text-muted)">Modern software, grounded in the daily realities of hospitality operations.</p><div className="mt-6 h-1 w-24 bg-(--brand-gold)" /></div>;
}

function BeliefRow({ description, icon: Icon, index, title }: { description: string; icon: LucideIcon; index: number; title: string }) {
  return <article className="grid gap-5 border-b border-(--border) py-7 sm:grid-cols-[3rem_0.7fr_1fr] sm:items-start"><span className="text-sm font-bold text-(--brand-gold)">0{index + 1}</span><div className="flex gap-3"><Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-(--text-muted)" /><h3 className="font-semibold text-(--text-strong)">{title}</h3></div><p className="text-sm leading-7 text-(--text-muted)">{description}</p></article>;
}
