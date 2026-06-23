import Link from "next/link";
import { notFound } from "next/navigation";
import { AmenitiesSection } from "@/components/public/AmenitiesSection";
import { RoomGallery } from "@/components/public/RoomGallery";
import { getPublicRoomTypeBySlug } from "@/features/public-room-types/queries";
import { formatPublicCurrency } from "@/lib/public/format";
import { buttonStyles } from "@/components/ui/button-styles";

export const dynamic = "force-dynamic";

type PublicRoomDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicRoomDetailsPage({
  params,
}: PublicRoomDetailsPageProps) {
  const { slug } = await params;
  const roomType = await getPublicRoomTypeBySlug(slug);

  if (!roomType) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <RoomGallery
          coverImage={roomType.coverImage}
          galleryImages={roomType.galleryImages}
          roomName={roomType.name}
        />
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a6f46]">
            Room details
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            {roomType.name}
          </h1>
          <p className="mt-4 leading-7 text-[#5f6b7a]">
            {roomType.description ?? "A comfortable room for your stay."}
          </p>
          <div className="mt-6 grid gap-4 border-y border-black/10 py-6 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#5f6b7a]">
                From
              </p>
              <p className="mt-1 font-semibold">
                {roomType.pricePerNight
                  ? formatPublicCurrency(roomType.pricePerNight)
                  : "Pending"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#5f6b7a]">
                Capacity
              </p>
              <p className="mt-1 font-semibold">
                {roomType.capacity ?? "Pending"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#5f6b7a]">
                Available
              </p>
              <p className="mt-1 font-semibold">
                {roomType.availableRoomCount}
              </p>
            </div>
          </div>
          <AmenitiesSection amenities={roomType.amenities} />
          <Link
            className={buttonStyles({
              className: "mt-8 w-full",
              shape: "pill",
              size: "lg",
            })}
            href={`/book?roomType=${roomType.slug}`}
          >
            Reserve this room type
          </Link>
        </div>
      </div>
    </section>
  );
}
