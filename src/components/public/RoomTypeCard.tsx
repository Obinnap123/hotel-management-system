"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import type { PublicRoomTypeSummary } from "@/features/public-room-types/queries";
import { formatPublicCurrency } from "@/lib/public/format";
import { publicReservationPath } from "@/lib/public/routes";

type RoomTypeCardProps = {
  roomType: PublicRoomTypeSummary;
  currency: string;
  compact?: boolean;
  eagerImage?: boolean;
};

export function RoomTypeCard({
  compact = false,
  currency,
  eagerImage = false,
  roomType,
}: RoomTypeCardProps) {
  const unavailable = roomType.roomInventoryCount === 0;
  const Heading = compact ? "h3" : "h2";
  const bookingHref = unavailable
    ? publicReservationPath("/book")
    : publicReservationPath(`/book?roomType=${roomType.slug}`);

  return (
    <motion.article className="group flex h-full min-w-0 flex-col" initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true, amount: 0.15 }} whileInView={{ opacity: 1, y: 0 }}>
      <Link className="relative block shrink-0 overflow-hidden bg-[var(--reservation-image-placeholder)]" href={publicReservationPath(`/rooms/${roomType.slug}`)}>
        <Image alt={`${roomType.name} room`} className="aspect-[4/3] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]" height={720} loading={eagerImage ? "eager" : "lazy"} sizes="(max-width: 639px) calc(100vw - 3rem), (max-width: 1279px) 50vw, 33vw" src={roomType.coverImage ?? fallbackRoomImage} unoptimized={Boolean(roomType.coverImage?.includes("res.cloudinary.com"))} width={960} />
        <span className={`absolute left-4 top-4 px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] ${unavailable ? "bg-white text-[#7d4a3d]" : "bg-[var(--reservation-primary)] text-[var(--reservation-on-primary)]"}`}>{unavailable ? "Ask reception" : `${roomType.roomInventoryCount} ${roomType.roomInventoryCount === 1 ? "room" : "rooms"}`}</span>
      </Link>
      <div className="flex flex-1 flex-col border border-t-0 border-[var(--reservation-line)] bg-[var(--reservation-paper)] px-5 py-6 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-5">
          <div className="min-w-0">
            <Heading className="font-serif text-[1.65rem] leading-tight tracking-[-0.025em] text-[var(--reservation-ink)]">{roomType.name}</Heading>
            <p className="mt-2 flex items-center gap-2 text-xs text-[var(--reservation-muted)]"><Users aria-hidden="true" className="h-3.5 w-3.5" /> {roomType.capacity ? `Up to ${roomType.capacity} guests` : "Capacity to confirm"}</p>
          </div>
          <p className="shrink-0 text-right text-sm font-semibold text-[var(--reservation-primary)]">{roomType.pricePerNight ? formatPublicCurrency(roomType.pricePerNight, currency) : "On request"}<span className="block text-[0.65rem] font-normal uppercase tracking-[0.1em] text-[var(--reservation-muted)]">per night</span></p>
        </div>
        <p className={`${compact ? "line-clamp-2" : "line-clamp-3"} mt-5 text-sm leading-7 text-[var(--reservation-muted)]`}>{roomType.description ?? "A calm, comfortable room prepared for an easy stay."}</p>
        {!compact && roomType.amenities.length > 0 ? <ul aria-label="Highlighted amenities" className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--reservation-muted)]">{roomType.amenities.slice(0, 3).map((amenity) => <li className="flex items-center gap-2" key={amenity}><span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--reservation-accent-copy)]" />{amenity}</li>)}</ul> : null}
        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between gap-4">
            <Link className="text-xs font-bold uppercase tracking-[0.13em] text-[var(--reservation-primary)] underline decoration-[var(--reservation-accent-copy)] underline-offset-4" href={publicReservationPath(`/rooms/${roomType.slug}`)}>View room</Link>
            <Link aria-label={unavailable ? `Find another room instead of ${roomType.name}` : `Check dates for ${roomType.name}`} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--reservation-primary)] px-4 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--reservation-on-primary)] transition hover:bg-[var(--reservation-primary-hover)]" href={bookingHref}>{unavailable ? "Find a room" : "Check dates"}<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

const fallbackRoomImage = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=84";
