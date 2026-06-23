"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { PublicRoomTypeSummary } from "@/features/public-room-types/queries";
import { formatPublicCurrency } from "@/lib/public/format";
import { buttonStyles } from "@/components/ui/button-styles";

type RoomTypeCardProps = {
  roomType: PublicRoomTypeSummary;
  compact?: boolean;
};

export function RoomTypeCard({ compact = false, roomType }: RoomTypeCardProps) {
  return (
    <motion.article
      className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition hover:shadow-md"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.18 }}
      whileHover={{ y: -3 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
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
              className={buttonStyles({
                shape: "pill",
                size: "sm",
                variant: "secondary",
              })}
              href={`/rooms/${roomType.slug}`}
            >
              Details
            </Link>
            <Link
              className={buttonStyles({ shape: "pill", size: "sm" })}
              href={`/book?roomType=${roomType.slug}`}
            >
              Reserve
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

const fallbackRoomImage =
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80";
