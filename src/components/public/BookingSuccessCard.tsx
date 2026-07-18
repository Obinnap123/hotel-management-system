"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { publicReservationPath } from "@/lib/public/routes";

type Props = { booking: string; roomType: string; checkIn: string; checkOut: string };

export function BookingSuccessCard({ booking, checkIn, checkOut, roomType }: Props) {
  return (
    <motion.div animate={{ opacity: 1, y: 0 }} className="border border-[#d9d3c8] bg-[#fbfaf6] p-7 text-center sm:p-12" initial={{ opacity: 0, y: 14 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#dfe8e2] text-[#286c59]"><Check aria-hidden="true" className="h-6 w-6" /></div>
      <p className="reservation-kicker mt-7">Reservation received</p>
      <h1 className="reservation-heading mx-auto mt-4 max-w-2xl">Your stay is now in the hotel’s hands.</h1>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#66716c]">Keep your booking number and present it at reception when you arrive.</p>
      <dl className="mx-auto mt-9 grid max-w-2xl border-l border-t border-[#d9d3c8] text-left sm:grid-cols-2">
        <SummaryItem label="Booking number" value={booking} /><SummaryItem label="Room type" value={roomType} /><SummaryItem label="Arrival" value={checkIn} /><SummaryItem label="Departure" value={checkOut} />
      </dl>
      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link className="inline-flex h-12 items-center justify-center gap-3 bg-[#173b32] px-6 text-xs font-bold uppercase tracking-[0.13em] text-white" href={publicReservationPath("/")}>Return home <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link><Link className="inline-flex h-12 items-center justify-center border border-[#bdb5a9] px-6 text-xs font-bold uppercase tracking-[0.13em] text-[#173b32]" href={publicReservationPath("/rooms")}>View rooms</Link></div>
    </motion.div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) { return <div className="border-b border-r border-[#d9d3c8] p-5"><dt className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#7c7164]">{label}</dt><dd className="mt-2 font-semibold text-[#22312d]">{value}</dd></div>; }
