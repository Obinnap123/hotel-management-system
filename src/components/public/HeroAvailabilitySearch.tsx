import { ArrowRight } from "lucide-react";
import { publicReservationPath } from "@/lib/public/routes";

export function HeroAvailabilitySearch() {
  return (
    <form action={publicReservationPath("/book")} className="mx-auto grid max-w-[82rem] border border-[#d9d3c8] bg-[#fbfaf6] p-2 text-[#22312d] shadow-[0_22px_60px_rgba(10,34,28,.22)] sm:grid-cols-2 lg:grid-cols-[1fr_1fr_.7fr_auto] lg:p-0">
      <SearchField label="Arrival"><input className="mt-1 h-8 w-full border-0 bg-transparent p-0 text-sm shadow-none! focus:shadow-none!" name="checkInDate" type="date" /></SearchField>
      <SearchField label="Departure"><input className="mt-1 h-8 w-full border-0 bg-transparent p-0 text-sm shadow-none! focus:shadow-none!" name="checkOutDate" type="date" /></SearchField>
      <SearchField label="Guests"><input className="mt-1 h-8 w-full border-0 bg-transparent p-0 text-sm shadow-none! focus:shadow-none!" defaultValue={1} min={1} name="guestCount" type="number" /></SearchField>
      <button className="m-1 inline-flex min-h-14 items-center justify-center gap-3 bg-[#173b32] px-7 text-xs font-bold uppercase tracking-[0.13em] text-white transition hover:bg-[#225044] sm:col-span-2 lg:col-span-1 lg:m-0 lg:min-h-24" type="submit">Check availability <ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
    </form>
  );
}

function SearchField({ children, label }: { children: React.ReactNode; label: string }) {
  return <label className="border-b border-[#d9d3c8] px-5 py-3 sm:border-b-0 sm:border-r lg:px-7 lg:py-5"><span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#765d45]">{label}</span>{children}</label>;
}
