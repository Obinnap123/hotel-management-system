import Image from "next/image";
import type { ReservationWebsiteCopy } from "@/lib/reservation-content";
import { MotionReveal } from "./MotionReveal";

export function AboutHotel({
  copy,
  hotelName,
  image,
}: {
  copy: Pick<
    ReservationWebsiteCopy,
    | "aboutEyebrow"
    | "aboutHeading"
    | "aboutBodyPrimary"
    | "aboutBodySecondary"
    | "aboutImageCaption"
  >;
  hotelName: string;
  image: {
    url: string;
    alternativeText: string;
  };
}) {
  return (
    <section className="reservation-container reservation-section" id="about">
      <div className="grid gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-20">
        <MotionReveal className="relative">
          <div className="absolute -left-3 -top-3 h-24 w-24 border-l border-t border-[var(--reservation-accent-copy)] sm:-left-5 sm:-top-5" />
          <Image alt={image.alternativeText || `A welcoming space at ${hotelName}`} className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]" height={1000} sizes="(max-width: 1023px) 100vw, 54vw" src={image.url} unoptimized={image.url.includes("res.cloudinary.com")} width={1200} />
          <div className="absolute -bottom-7 right-0 max-w-[15rem] bg-[var(--reservation-paper)] p-5 shadow-[0_18px_50px_rgba(24,45,39,.16)] sm:right-8"><p className="font-serif text-xl leading-tight text-[var(--reservation-primary)]">{copy.aboutImageCaption}</p></div>
        </MotionReveal>

        <MotionReveal delay={0.08}>
          <p className="reservation-kicker">{copy.aboutEyebrow}</p>
          <h2 className="reservation-heading mt-4">{copy.aboutHeading}</h2>
          <div className="mt-8 space-y-5 text-sm leading-7 text-[var(--reservation-muted)] sm:text-base sm:leading-8">
            <p>{copy.aboutBodyPrimary}</p>
            <p>{copy.aboutBodySecondary}</p>
          </div>
          <dl className="mt-10 border-t border-[var(--reservation-line)]">
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
  return <div className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-[var(--reservation-line)] py-5"><dt className="text-xs font-bold text-[var(--reservation-accent-copy)]">{number}</dt><dd><p className="font-semibold text-[var(--reservation-ink)]">{title}</p><p className="mt-1 text-sm leading-6 text-[var(--reservation-muted)]">{detail}</p></dd></div>;
}
