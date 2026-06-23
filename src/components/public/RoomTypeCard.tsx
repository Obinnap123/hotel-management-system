import Link from "next/link";
import type { PublicRoomTypeSummary } from "@/features/public-room-types/queries";
import { formatPublicCurrency } from "@/lib/public/format";

type RoomTypeCardProps = {
  roomType: PublicRoomTypeSummary;
  compact?: boolean;
};

export function RoomTypeCard({ compact = false, roomType }: RoomTypeCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/rooms/${roomType.slug}`}>
        <img
          alt={`${roomType.name} room`}
          className="h-56 w-full object-cover"
          src={roomType.coverImage ?? fallbackRoomImage}
        />
      </Link>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{roomType.name}</h2>
            <p className="mt-1 text-sm text-[#5f6b7a]">
              Capacity {roomType.capacity ?? "pending"}
            </p>
          </div>
          <p className="text-sm font-semibold text-[#8a6f46]">
            {roomType.pricePerNight
              ? formatPublicCurrency(roomType.pricePerNight)
              : "Price pending"}
          </p>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-[#5f6b7a]">
          {roomType.description ?? "A comfortable room for your stay."}
        </p>
        {!compact ? (
          <div className="flex flex-wrap gap-2">
            {roomType.amenities.slice(0, 4).map((amenity) => (
              <span
                className="rounded-full bg-[#f1ebe1] px-3 py-1 text-xs font-medium text-[#6b5637]"
                key={amenity}
              >
                {amenity}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3 border-t border-black/10 pt-4">
          <p className="text-sm text-[#5f6b7a]">
            {roomType.availableRoomCount} available
          </p>
          <div className="flex gap-2">
            <Link
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[#172033] hover:bg-black/5"
              href={`/rooms/${roomType.slug}`}
            >
              Details
            </Link>
            <Link
              className="rounded-full bg-[#172033] px-4 py-2 text-sm font-semibold text-white hover:bg-[#24314a]"
              href={`/book?roomType=${roomType.slug}`}
            >
              Reserve
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

const fallbackRoomImage =
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80";
