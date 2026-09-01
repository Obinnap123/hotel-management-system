import type { ReservationWebsiteCopy } from "@/lib/reservation-content";
import type { ReservationFacility } from "@/lib/reservation-facilities";
import { MotionReveal } from "./MotionReveal";
import { ReservationFacilityIcon } from "./ReservationFacilityIcon";

export function HomeAmenities({
  copy,
  facilities,
}: {
  copy: Pick<
    ReservationWebsiteCopy,
    "amenitiesEyebrow" | "amenitiesHeading" | "amenitiesDescription"
  >;
  facilities: ReservationFacility[];
}) {
  return (
    <section className="border-y border-white/12 bg-[var(--reservation-primary)] text-[var(--reservation-on-primary)]">
      <div className="reservation-container reservation-section">
        <MotionReveal className="grid gap-7 lg:grid-cols-[.65fr_1fr] lg:items-end">
          <div><p className="reservation-kicker reservation-kicker-on-primary">{copy.amenitiesEyebrow}</p><h2 className="reservation-heading mt-4 max-w-lg">{copy.amenitiesHeading}</h2></div>
          <p className="max-w-xl text-sm leading-7 text-white/62 lg:justify-self-end">{copy.amenitiesDescription}</p>
        </MotionReveal>
        <div className="mt-12 grid border-l border-t border-white/15 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility, index) => {
            return <MotionReveal className="border-b border-r border-white/15 p-6 sm:p-7" delay={index * 0.035} key={facility.id}><ReservationFacilityIcon className="h-5 w-5 text-[var(--reservation-accent-on-primary)]" iconKey={facility.iconKey} /><h3 className="mt-7 font-serif text-xl">{facility.title}</h3><p className="mt-2 text-sm leading-6 text-white/58">{facility.description}</p></MotionReveal>;
          })}
        </div>
      </div>
    </section>
  );
}
