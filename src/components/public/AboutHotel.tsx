import Image from "next/image";
import { MotionReveal } from "./MotionReveal";

export function AboutHotel({ hotelName }: { hotelName: string }) {
  return (
    <section className="reservation-container reservation-section" id="about">
      <div className="grid gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-20">
        <MotionReveal className="relative">
          <div className="absolute -left-3 -top-3 h-24 w-24 border-l border-t border-[#a67c45] sm:-left-5 sm:-top-5" />
          <Image alt={`A welcoming lounge at ${hotelName}`} className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]" height={1000} sizes="(max-width: 1023px) 100vw, 54vw" src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1500&q=86" width={1200} />
          <div className="absolute -bottom-7 right-0 max-w-[15rem] bg-[#fbfaf6] p-5 shadow-[0_18px_50px_rgba(24,45,39,.16)] sm:right-8"><p className="font-serif text-xl leading-tight text-[#173b32]">A calm base for business, leisure, and everything between.</p></div>
        </MotionReveal>

        <MotionReveal delay={0.08}>
          <p className="reservation-kicker">The character of our hotel</p>
          <h2 className="reservation-heading mt-4">Hospitality feels best when nothing is complicated.</h2>
          <div className="mt-8 space-y-5 text-sm leading-7 text-[#66716c] sm:text-base sm:leading-8">
            <p>{hotelName} brings together warm service, practical comfort, and a simple direct-reservation experience.</p>
            <p>From the moment a reservation is placed, reception has the details needed to prepare for arrival and carry the stay through with clarity.</p>
          </div>
          <dl className="mt-10 border-t border-[#d9d3c8]">
            <Fact number="01" title="Reserve directly" detail="Choose a room and send your stay details without creating an account." />
            <Fact number="02" title="Arrive prepared" detail="Your booking details are already available to reception." />
            <Fact number="03" title="Stay supported" detail="Hotel staff manage payment, arrival, and departure in one clear flow." />
          </dl>
        </MotionReveal>
      </div>
    </section>
  );
}

function Fact({ detail, number, title }: { detail: string; number: string; title: string }) {
  return <div className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-[#d9d3c8] py-5"><dt className="text-xs font-bold text-[#a67c45]">{number}</dt><dd><p className="font-semibold text-[#22312d]">{title}</p><p className="mt-1 text-sm leading-6 text-[#6b746f]">{detail}</p></dd></div>;
}
