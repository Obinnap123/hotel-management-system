import Link from "next/link";
import { AboutHotel } from "@/components/public/AboutHotel";
import { HomeAmenities } from "@/components/public/HomeAmenities";
import { PublicHero } from "@/components/public/PublicHero";
import { RoomTypeCard } from "@/components/public/RoomTypeCard";
import { Testimonials } from "@/components/public/Testimonials";
import { getFeaturedPublicRoomTypes } from "@/features/public-room-types/queries";

export const dynamic = "force-dynamic";

export default async function PublicHomePage() {
  const featuredRoomTypes = await getFeaturedPublicRoomTypes();

  return (
    <div>
      <PublicHero />

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a6f46]">
              Featured stays
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Featured room types
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#5f6b7a]">
              Explore room categories guests can reserve online. Current
              availability updates as reservations are made.
            </p>
          </div>
          <Link className="text-sm font-semibold text-[#172033]" href="/rooms">
            See all rooms
          </Link>
        </div>

        {featuredRoomTypes.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featuredRoomTypes.map((roomType) => (
              <RoomTypeCard compact key={roomType.slug} roomType={roomType} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-black/15 bg-white/70 p-8 text-center">
            <p className="font-semibold text-[#172033]">
              Room types are being prepared.
            </p>
            <p className="mt-2 text-sm text-[#5f6b7a]">
              Please check back soon or contact reception for current
              availability.
            </p>
          </div>
        )}
      </section>

      <HomeAmenities />
      <AboutHotel />
      <Testimonials />
    </div>
  );
}
