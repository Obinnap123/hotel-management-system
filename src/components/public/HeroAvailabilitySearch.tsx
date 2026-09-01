import { ArrowRight } from "lucide-react";
import { publicReservationPath } from "@/lib/public/routes";

export function HeroAvailabilitySearch() {
  return (
    <form action={publicReservationPath("/book")} className="mx-auto grid w-full min-w-0 max-w-[82rem] border border-[var(--reservation-line)] bg-[var(--reservation-paper)] p-2 text-[var(--reservation-ink)] shadow-[0_22px_60px_rgba(10,34,28,.22)] sm:grid-cols-2 lg:grid-cols-[1fr_1fr_.7fr_auto] lg:p-0">
      <SearchField className="sm:border-r lg:border-b-0" label="Arrival"><input className="mt-2 block h-8 w-full min-w-0 max-w-full border-0 bg-transparent p-0 text-sm shadow-none! focus:shadow-none!" name="checkInDate" type="date" /></SearchField>
      <SearchField className="lg:border-b-0 lg:border-r" label="Departure"><input className="mt-2 block h-8 w-full min-w-0 max-w-full border-0 bg-transparent p-0 text-sm shadow-none! focus:shadow-none!" name="checkOutDate" type="date" /></SearchField>
      <SearchField className="sm:border-b-0 sm:border-r" label="Guests"><input className="mt-2 block h-8 w-full min-w-0 max-w-full border-0 bg-transparent p-0 text-sm shadow-none! focus:shadow-none!" defaultValue={1} min={1} name="guestCount" type="number" /></SearchField>
      <button className="m-1 inline-flex min-h-14 items-center justify-center gap-3 bg-[var(--reservation-primary)] px-7 text-xs font-bold uppercase tracking-[0.13em] text-[var(--reservation-on-primary)] transition hover:bg-[var(--reservation-primary-hover)] lg:m-0 lg:min-h-24" type="submit">Check availability <ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
    </form>
  );
}

function SearchField({ children, className = "", label }: { children: React.ReactNode; className?: string; label: string }) {
  return <label className={`min-w-0 overflow-hidden border-b border-[var(--reservation-line)] px-5 py-3 lg:px-7 lg:py-5 ${className}`}><span className="block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[var(--reservation-subtle)]">{label}</span>{children}</label>;
}
