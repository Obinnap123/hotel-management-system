import Link from "next/link";
import { AboutHotel } from "@/components/public/AboutHotel";
import { HomeAmenities } from "@/components/public/HomeAmenities";
import { MotionReveal } from "@/components/public/MotionReveal";
import { PublicHero } from "@/components/public/PublicHero";
import { RoomTypeCard } from "@/components/public/RoomTypeCard";
import { Testimonials } from "@/components/public/Testimonials";
import { getFeaturedPublicRoomTypes } from "@/features/public-room-types/queries";
import { getReservationSiteConfig } from "@/features/settings/queries";
import { publicReservationPath } from "@/lib/public/routes";

export const dynamic = "force-dynamic";

export default async function PublicHomePage() {
  const [featuredRoomTypes, config] = await Promise.all([
    getFeaturedPublicRoomTypes(),
    getReservationSiteConfig(),
  ]);

  return (
    <div>
      <PublicHero
        copy={config.website.copy}
        heroImages={config.website.heroImages.map((image) => image.url)}
      />

      <section className="reservation-container reservation-section" id="featured-stays">
        <MotionReveal>
          <div className="grid gap-7 md:grid-cols-[1fr_.65fr] md:items-end">
            <div>
              <p className="reservation-kicker">{config.website.copy.featuredEyebrow}</p>
              <h2 className="reservation-heading mt-4">{config.website.copy.featuredHeading}</h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-[var(--reservation-muted)] md:justify-self-end">{config.website.copy.featuredDescription}</p>
            <Link
              className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--reservation-accent-copy)] underline decoration-[var(--reservation-accent-copy)] underline-offset-8 md:col-start-2 md:justify-self-end"
              href={publicReservationPath("/rooms")}
            >
              {config.website.copy.featuredCtaLabel}
            </Link>
          </div>
        </MotionReveal>

        {featuredRoomTypes.length > 0 ? (
          <div className="mt-10 grid auto-rows-fr gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRoomTypes.map((roomType) => (
              <RoomTypeCard
                compact
                currency={config.hotel.currency}
                key={roomType.slug}
                roomType={roomType}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-[var(--reservation-line-strong)] bg-[var(--reservation-paper)] p-10 text-center">
            <p className="font-semibold text-[var(--reservation-ink)]">
              Room types are being prepared.
            </p>
            <p className="mt-2 text-sm text-[var(--reservation-muted)]">
              Please check back soon or contact reception for current
              availability.
            </p>
          </div>
        )}
      </section>

      <HomeAmenities
        copy={config.website.copy}
        facilities={config.website.facilities}
      />
      <AboutHotel
        copy={config.website.copy}
        hotelName={config.hotel.name}
        image={config.website.aboutImage}
      />
      <Testimonials />
    </div>
  );
}
