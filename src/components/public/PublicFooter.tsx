import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { publicReservationPath } from "@/lib/public/routes";
import type { ReservationWebsiteCopy } from "@/lib/reservation-content";

type PublicFooterProps = {
  copy: Pick<
    ReservationWebsiteCopy,
    "footerEyebrow" | "footerHeading" | "footerCtaLabel"
  >;
  hotelName: string;
  phoneNumber: string;
  emailAddress: string;
  physicalAddress: string;
};

export function PublicFooter({ copy, emailAddress, hotelName, phoneNumber, physicalAddress }: PublicFooterProps) {
  return (
    <footer className="bg-[var(--reservation-primary-deep)] text-[var(--reservation-on-primary)]">
      <div className="reservation-container py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_.55fr_.85fr]">
          <div className="max-w-md">
            <p className="reservation-kicker reservation-kicker-on-primary">{copy.footerEyebrow}</p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.02] tracking-[-0.03em] sm:text-5xl">{copy.footerHeading}</h2>
            <Link className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[var(--reservation-accent)] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--reservation-on-accent)] transition hover:bg-[var(--reservation-accent-hover)]" href={publicReservationPath("/book")}>{copy.footerCtaLabel} <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" /></Link>
          </div>
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/65">Explore</p>
            <nav aria-label="Footer navigation" className="mt-6 grid gap-4 text-sm text-white/72">
              <Link className="hover:text-white" href={publicReservationPath("/")}>Home</Link>
              <Link className="hover:text-white" href={publicReservationPath("/rooms")}>Rooms & suites</Link>
              <Link className="hover:text-white" href={publicReservationPath("/#about")}>Our hotel</Link>
              <Link className="hover:text-white" href={publicReservationPath("/book")}>Reservations</Link>
            </nav>
          </div>
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/65">Find us</p>
            <div className="mt-6 grid gap-5 text-sm leading-6 text-white/72">
              {physicalAddress ? <p className="flex gap-3"><MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--reservation-accent-on-primary)]" />{physicalAddress}</p> : null}
              {phoneNumber ? <a className="flex gap-3 hover:text-white" href={`tel:${phoneNumber}`}><Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--reservation-accent-on-primary)]" />{phoneNumber}</a> : null}
              {emailAddress ? <a className="flex gap-3 break-all hover:text-white" href={`mailto:${emailAddress}`}><Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--reservation-accent-on-primary)]" />{emailAddress}</a> : null}
              {!physicalAddress && !phoneNumber && !emailAddress ? <p>Contact details are available through hotel reception.</p> : null}
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-white/12 pt-6 text-[0.68rem] uppercase tracking-[0.12em] text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {hotelName}</p>
          <div className="flex items-center gap-5"><p>Direct reservations</p><Link className="hover:text-white" href="/login">Staff login</Link></div>
        </div>
      </div>
    </footer>
  );
}
