import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RoomTypeCard } from "@/components/public/RoomTypeCard";
import { getAllPublicRoomTypes } from "@/features/public-room-types/queries";
import { publicReservationPath } from "@/lib/public/routes";

export const dynamic = "force-dynamic";

export default async function PublicRoomsPage() {
  const roomTypes = await getAllPublicRoomTypes();

  return (
    <>
      <header className="bg-[#173b32] py-16 text-white sm:py-24">
        <div className="reservation-container grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
          <div><p className="reservation-kicker text-[#e3ce9f]!">Rooms & suites</p><h1 className="reservation-heading mt-4 max-w-3xl">A room for settling in, not simply checking in.</h1></div>
          <p className="max-w-lg text-sm leading-7 text-white/65 lg:justify-self-end">Browse each room category by space, amenities, guest capacity, and live availability. Your final room is assigned from the category you reserve.</p>
        </div>
      </header>
      <section className="reservation-container reservation-section">
        {roomTypes.length > 0 ? <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">{roomTypes.map((roomType) => <RoomTypeCard key={roomType.slug} roomType={roomType} />)}</div> : <div className="border border-dashed border-[#c9c1b4] bg-[#fbfaf6] px-6 py-16 text-center"><h2 className="font-serif text-3xl">Our room collection is being prepared.</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#66716c]">Contact reception for current room options, or return shortly to reserve online.</p><Link className="mt-7 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-[#173b32]" href={publicReservationPath("/")}>Return home <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></div>}
      </section>
    </>
  );
}
