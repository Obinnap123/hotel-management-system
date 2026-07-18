"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import type { PublicRoomTypeSummary } from "@/features/public-room-types/queries";
import { formatPublicCurrency } from "@/lib/public/format";
import { publicReservationPath } from "@/lib/public/routes";

type RoomTypeCardProps = { roomType: PublicRoomTypeSummary; compact?: boolean };

export function RoomTypeCard({ compact = false, roomType }: RoomTypeCardProps) {
  const unavailable = roomType.availableRoomCount === 0;
  const Heading = compact ? "h3" : "h2";

  return (
    <motion.article className="group min-w-0" initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true, amount: 0.15 }} whileInView={{ opacity: 1, y: 0 }}>
      <Link className="relative block overflow-hidden bg-[#dfe5e0]" href={publicReservationPath(`/rooms/${roomType.slug}`)}>
        <Image alt={`${roomType.name} room`} className="aspect-[4/3] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]" height={720} sizes="(max-width: 767px) 100vw, 33vw" src={roomType.coverImage ?? fallbackRoomImage} unoptimized={Boolean(roomType.coverImage?.includes("res.cloudinary.com"))} width={960} />
        <span className={`absolute left-4 top-4 px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] ${unavailable ? "bg-white text-[#7d4a3d]" : "bg-[#173b32] text-white"}`}>{unavailable ? "Ask reception" : `${roomType.availableRoomCount} available`}</span>
      </Link>
      <div className="border-x border-b border-[#d9d3c8] bg-[#fbfaf6] px-5 py-6 sm:px-6">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <Heading className="font-serif text-[1.65rem] leading-tight tracking-[-0.025em] text-[#22312d]">{roomType.name}</Heading>
            <p className="mt-2 flex items-center gap-2 text-xs text-[#69736e]"><Users aria-hidden="true" className="h-3.5 w-3.5" /> {roomType.capacity ? `Up to ${roomType.capacity} guests` : "Capacity to confirm"}</p>
          </div>
          <p className="shrink-0 text-right text-sm font-semibold text-[#173b32]">{roomType.pricePerNight ? formatPublicCurrency(roomType.pricePerNight) : "On request"}<span className="block text-[0.65rem] font-normal uppercase tracking-[0.1em] text-[#7a827e]">per night</span></p>
        </div>
        <p className="mt-5 line-clamp-2 text-sm leading-7 text-[#66716c]">{roomType.description ?? "A calm, comfortable room prepared for an easy stay."}</p>
        {!compact && roomType.amenities.length > 0 ? <p className="mt-5 truncate border-t border-[#e4dfd5] pt-4 text-xs text-[#6b746f]">{roomType.amenities.slice(0, 3).join("  ·  ")}</p> : null}
        <div className="mt-6 flex items-center justify-between border-t border-[#e4dfd5] pt-5">
          <Link className="text-xs font-bold uppercase tracking-[0.13em] text-[#173b32] underline decoration-[#b58d55] underline-offset-4" href={publicReservationPath(`/rooms/${roomType.slug}`)}>View room</Link>
          <Link aria-label={`Reserve ${roomType.name}`} className="inline-grid h-10 w-10 place-items-center bg-[#173b32] text-white transition hover:bg-[#225044]" href={publicReservationPath(`/book?roomType=${roomType.slug}`)}><ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
        </div>
      </div>
    </motion.article>
  );
}

const fallbackRoomImage = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=84";
