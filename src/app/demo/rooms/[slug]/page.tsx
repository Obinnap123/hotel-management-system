import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BedDouble, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { AmenitiesSection } from "@/components/public/AmenitiesSection";
import { RoomGallery } from "@/components/public/RoomGallery";
import { getPublicRoomTypeBySlug } from "@/features/public-room-types/queries";
import { getReservationSiteConfig } from "@/features/settings/queries";
import { formatPublicCurrency } from "@/lib/public/format";
import { publicReservationPath } from "@/lib/public/routes";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export default async function PublicRoomDetailsPage({ params }: Props) {
  const { slug } = await params;
  const [roomType, config] = await Promise.all([
    getPublicRoomTypeBySlug(slug),
    getReservationSiteConfig(),
  ]);
  if (!roomType) notFound();
  const hasInventory = roomType.roomInventoryCount > 0;

  return (
    <section className="reservation-container reservation-section py-10! sm:py-14!">
      <Link className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[#53605b] hover:text-[#173b32]" href={publicReservationPath("/rooms")}><ArrowLeft aria-hidden="true" className="h-4 w-4" /> All rooms</Link>
      <div className="grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-start lg:gap-16">
        <RoomGallery coverImage={roomType.coverImage} galleryImages={roomType.galleryImages} roomName={roomType.name} />
        <div className="lg:sticky lg:top-28">
          <p className="reservation-kicker">Room details</p>
          <h1 className="reservation-heading mt-4">{roomType.name}</h1>
          <p className="mt-6 text-sm leading-7 text-[#66716c] sm:text-base sm:leading-8">{roomType.description ?? "A comfortable, well-prepared room designed for an easy stay."}</p>
          <dl className="mt-8 grid grid-cols-2 border-y border-[#d9d3c8] sm:grid-cols-3">
            <RoomFact icon={<BedDouble />} label="Nightly rate" value={roomType.pricePerNight ? formatPublicCurrency(roomType.pricePerNight, config.hotel.currency) : "On request"} />
            <RoomFact icon={<Users />} label="Sleeps" value={`${roomType.capacity ?? "—"} guests`} />
            <div className="col-span-2 border-t border-[#d9d3c8] px-4 py-5 sm:col-span-1 sm:border-l sm:border-t-0"><dt className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#7c7164]">Room inventory</dt><dd className={`mt-2 text-sm font-semibold ${hasInventory ? "text-[#28705b]" : "text-[#8a5142]"}`}>{hasInventory ? `${roomType.roomInventoryCount} ${roomType.roomInventoryCount === 1 ? "room" : "rooms"} in this category` : "Please ask reception"}</dd></div>
          </dl>
          <AmenitiesSection amenities={roomType.amenities} />
          <Link className="mt-9 inline-flex h-13 w-full items-center justify-center gap-3 bg-[#173b32] px-6 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#225044]" href={publicReservationPath(`/book?roomType=${roomType.slug}`)}>Reserve this room <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
          <p className="mt-4 text-center text-xs leading-5 text-[#737c77]">No account required. Your reservation goes directly to hotel reception.</p>
        </div>
      </div>
    </section>
  );
}

function RoomFact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="px-4 py-5 first:border-r first:border-[#d9d3c8] sm:first:border-r-0 sm:[&:nth-child(2)]:border-l sm:[&:nth-child(2)]:border-[#d9d3c8]"><dt className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#7c7164]"><span aria-hidden="true" className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>{label}</dt><dd className="mt-2 text-sm font-semibold text-[#22312d]">{value}</dd></div>; }
