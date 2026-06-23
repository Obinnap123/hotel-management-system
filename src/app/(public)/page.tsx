import Link from "next/link";
import { HeroAvailabilitySearch } from "@/components/public/HeroAvailabilitySearch";
import { RoomTypeCard } from "@/components/public/RoomTypeCard";
import { getFeaturedPublicRoomTypes } from "@/features/public-room-types/queries";

export const dynamic = "force-dynamic";

export default async function PublicHomePage() {
  const featuredRoomTypes = await getFeaturedPublicRoomTypes();

  return (
    <div>
      <section className="relative overflow-hidden bg-[#172033] text-white">
        <div className="absolute inset-0 opacity-35">
          <img
            alt=""
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80"
          />
        </div>
        <div className="relative mx-auto grid min-h-[72vh] max-w-7xl items-end px-5 py-16 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/75">
              Luxury hotel reservations
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
              Obinna&apos;s Hotel
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/82">
              Browse room types, check availability, and reserve your stay in a
              few simple steps.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#172033] hover:bg-white/90"
                href="/book"
              >
                Reserve now
              </Link>
              <Link
                className="rounded-full border border-white/35 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                href="/rooms"
              >
                View rooms
              </Link>
            </div>
            <HeroAvailabilitySearch />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a6f46]">
              Featured stays
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Room types available now
            </h2>
          </div>
          <Link className="text-sm font-semibold text-[#172033]" href="/rooms">
            See all rooms
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featuredRoomTypes.map((roomType) => (
            <RoomTypeCard compact key={roomType.slug} roomType={roomType} />
          ))}
        </div>
      </section>
    </div>
  );
}
