import Link from "next/link";
import { ArrowRight, BedDouble, CalendarCheck2, KeyRound } from "lucide-react";
import { publicReservationPath } from "@/lib/public/routes";
import { MotionReveal } from "./MotionReveal";

const steps = [
  { number: "01", title: "Choose your room", detail: "Compare room types, amenities, capacity, and live availability.", icon: BedDouble },
  { number: "02", title: "Reserve directly", detail: "Share your dates and guest details through the secure reservation form.", icon: CalendarCheck2 },
  { number: "03", title: "Arrive with confidence", detail: "Bring your booking number; reception takes care of the rest.", icon: KeyRound },
];

export function Testimonials() {
  return (
    <section className="bg-[#ebe6dc]">
      <div className="reservation-container reservation-section">
        <MotionReveal className="max-w-3xl"><p className="reservation-kicker">Your stay, clearly arranged</p><h2 className="reservation-heading mt-4">From room search to reception in three simple steps.</h2></MotionReveal>
        <div className="mt-12 grid border-t border-[#cfc7bb] md:grid-cols-3">
          {steps.map((step, index) => { const Icon = step.icon; return <MotionReveal className="border-b border-[#cfc7bb] py-8 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0" delay={index * 0.05} key={step.number}><div className="flex items-center justify-between"><span className="text-xs font-bold text-[#a67c45]">{step.number}</span><Icon aria-hidden="true" className="h-5 w-5 text-[#173b32]" strokeWidth={1.5} /></div><h3 className="mt-10 font-serif text-2xl text-[#22312d]">{step.title}</h3><p className="mt-3 max-w-sm text-sm leading-7 text-[#66716c]">{step.detail}</p></MotionReveal>; })}
        </div>
        <MotionReveal className="mt-10"><Link className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-[#173b32]" href={publicReservationPath("/book")}>Plan your stay <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></MotionReveal>
      </div>
    </section>
  );
}
