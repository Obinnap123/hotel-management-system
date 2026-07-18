import { Check } from "lucide-react";

export function AmenitiesSection({ amenities }: { amenities: string[] }) {
  return (
    <section className="mt-8 border-t border-[#d9d3c8] pt-7">
      <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#806f59]">Room amenities</h2>
      {amenities.length > 0 ? <ul className="mt-5 grid gap-x-5 gap-y-3 sm:grid-cols-2">{amenities.map((amenity) => <li className="flex items-start gap-3 text-sm text-[#53605b]" key={amenity}><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#a67c45]" />{amenity}</li>)}</ul> : <p className="mt-4 text-sm text-[#66716c]">Amenity details are being updated. Reception can help with a specific request.</p>}
    </section>
  );
}
