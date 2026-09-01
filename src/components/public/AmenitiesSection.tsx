import { Check } from "lucide-react";

export function AmenitiesSection({ amenities }: { amenities: string[] }) {
  return (
    <section className="mt-8 border-t border-[var(--reservation-line)] pt-7">
      <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--reservation-subtle)]">Room amenities</h2>
      {amenities.length > 0 ? <ul className="mt-5 grid gap-x-5 gap-y-3 sm:grid-cols-2">{amenities.map((amenity) => <li className="flex items-start gap-3 text-sm text-[var(--reservation-muted)]" key={amenity}><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--reservation-accent-copy)]" />{amenity}</li>)}</ul> : <p className="mt-4 text-sm text-[var(--reservation-muted)]">Amenity details are being updated. Reception can help with a specific request.</p>}
    </section>
  );
}
