"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";

type BookingSuccessCardProps = {
  booking: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
};

export function BookingSuccessCard({
  booking,
  checkIn,
  checkOut,
  roomType,
}: BookingSuccessCardProps) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="rounded-2xl border border-black/10 bg-white p-8 text-center shadow-[0_20px_55px_rgba(23,32,51,0.08)]"
      initial={{ opacity: 0, scale: 0.98, y: 16 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
        <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
      </div>
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#8a6f46]">
        Reservation successful
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        Your reservation has been received.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-[#5f6b7a]">
        Please present your booking number at the hotel reception when you
        arrive.
      </p>

      <div className="mx-auto mt-8 grid max-w-xl gap-4 rounded-xl bg-[#f7f3ed] p-5 text-left sm:grid-cols-2">
        <SummaryItem label="Booking number" value={booking} />
        <SummaryItem label="Room type" value={roomType} />
        <SummaryItem label="Check-in" value={checkIn} />
        <SummaryItem label="Check-out" value={checkOut} />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          className={buttonStyles({ shape: "pill", size: "lg" })}
          href="/"
        >
          Back home
        </Link>
        <Link
          className={buttonStyles({
            shape: "pill",
            size: "lg",
            variant: "secondary",
          })}
          href="/rooms"
        >
          View rooms
        </Link>
      </div>
    </motion.div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#5f6b7a]">
        {label}
      </p>
      <p className="mt-1 font-semibold text-[#172033]">{value}</p>
    </div>
  );
}
