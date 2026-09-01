import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RoomTypeCard } from "@/components/public/RoomTypeCard";
import { getAllPublicRoomTypes } from "@/features/public-room-types/queries";
import { getReservationSiteConfig } from "@/features/settings/queries";
import { publicReservationPath } from "@/lib/public/routes";

export const dynamic = "force-dynamic";

export default async function PublicRoomsPage() {
  const [roomTypes, config] = await Promise.all([
    getAllPublicRoomTypes(),
    getReservationSiteConfig(),
  ]);

  return (
    <>
      <header className="bg-[var(--reservation-primary)] py-14 text-[var(--reservation-on-primary)] sm:py-20 lg:py-24">
        <div className="reservation-container grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
          <div><p className="reservation-kicker reservation-kicker-on-primary">{config.website.copy.roomsEyebrow}</p><h1 className="reservation-heading mt-4 max-w-3xl">{config.website.copy.roomsHeading}</h1></div>
          <p className="max-w-lg text-sm leading-7 text-white/70 lg:justify-self-end">{config.website.copy.roomsDescription}</p>
        </div>
      </header>
      <section className="reservation-container py-16 sm:py-20 lg:py-24">
        {roomTypes.length > 0 ? <div className="grid auto-rows-fr gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">{roomTypes.map((roomType, index) => <RoomTypeCard currency={config.hotel.currency} eagerImage={index < 3} key={roomType.slug} roomType={roomType} />)}</div> : <div className="border border-dashed border-[var(--reservation-line-strong)] bg-[var(--reservation-paper)] px-6 py-16 text-center"><h2 className="font-serif text-3xl">Our room collection is being prepared.</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--reservation-muted)]">Contact reception for current room options, or return shortly to reserve online.</p><Link className="mt-7 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--reservation-primary)]" href={publicReservationPath("/")}>Return home <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></div>}
      </section>
    </>
  );
}
