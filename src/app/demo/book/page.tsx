import Link from "next/link";
import { ArrowLeft, Check, Clock3, ShieldCheck } from "lucide-react";
import { BookingForm } from "@/components/public/BookingForm";
import { getAllPublicRoomTypes } from "@/features/public-room-types/queries";
import { getReservationSiteConfig } from "@/features/settings/queries";
import { publicReservationPath } from "@/lib/public/routes";

export const dynamic = "force-dynamic";
type Props = { searchParams?: Promise<{ checkInDate?: string; checkOutDate?: string; guestCount?: string; roomType?: string }> };

export default async function PublicBookPage({ searchParams }: Props) {
  const [roomTypes, params, config] = await Promise.all([
    getAllPublicRoomTypes(),
    searchParams,
    getReservationSiteConfig(),
  ]);

  return (
    <section className="reservation-container reservation-section py-10! sm:py-16!">
      <Link className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[#53605b] hover:text-[#173b32]" href={publicReservationPath("/rooms")}><ArrowLeft aria-hidden="true" className="h-4 w-4" /> Browse rooms</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
        <aside className="order-2 bg-[#173b32] p-7 text-white sm:p-10 lg:order-1 lg:sticky lg:top-28 lg:self-start">
          <p className="reservation-kicker text-[#e3ce9f]!">Direct reservation</p>
          <h1 className="mt-5 font-serif text-4xl leading-[1.02] tracking-[-0.03em] sm:text-5xl">Your stay at {config.hotel.name}.</h1>
          <p className="mt-6 text-sm leading-7 text-white/65">Share your preferred room and dates. The request enters the hotel’s live reservation system for reception to prepare your stay.</p>
          <ul className="mt-9 border-t border-white/15">
            <Assurance icon={<ShieldCheck />} text="Your details go directly to hotel reception" />
            <Assurance icon={<Clock3 />} text={`Standard check-in ${config.hotel.defaultCheckInTime}; check-out ${config.hotel.defaultCheckOutTime}`} />
            <Assurance icon={<Check />} text="No guest account or separate sign-in required" />
          </ul>
          {(config.hotel.phoneNumber || config.hotel.emailAddress) ? <div className="mt-8 border-t border-white/15 pt-6 text-xs leading-6 text-white/50"><p>Need help before reserving?</p>{config.hotel.phoneNumber ? <a className="mt-1 block text-white/80 hover:text-white" href={`tel:${config.hotel.phoneNumber}`}>{config.hotel.phoneNumber}</a> : null}{config.hotel.emailAddress ? <a className="block break-all text-white/80 hover:text-white" href={`mailto:${config.hotel.emailAddress}`}>{config.hotel.emailAddress}</a> : null}</div> : null}
        </aside>
        <div className="order-1 bg-[#fbfaf6] p-6 sm:p-10 lg:order-2 lg:p-12">
          <p className="reservation-kicker">Reservation details</p>
          <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] text-[#22312d]">Plan your arrival.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#66716c]">All fields are required unless marked optional. Your reservation goes directly to hotel reception.</p>
          <BookingForm defaultCheckInDate={params?.checkInDate} defaultCheckOutDate={params?.checkOutDate} defaultGuestCount={params?.guestCount} defaultRoomTypeSlug={params?.roomType} roomTypes={roomTypes} />
        </div>
      </div>
    </section>
  );
}

function Assurance({ icon, text }: { icon: React.ReactNode; text: string }) { return <li className="flex gap-3 border-b border-white/15 py-5 text-sm leading-6 text-white/75"><span aria-hidden="true" className="mt-0.5 text-[#ddc796] [&>svg]:h-4 [&>svg]:w-4">{icon}</span>{text}</li>; }
