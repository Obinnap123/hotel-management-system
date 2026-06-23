import Link from "next/link";
import { formatPublicDate } from "@/lib/public/format";

type BookingSuccessPageProps = {
  searchParams?: Promise<{
    booking?: string;
    roomType?: string;
    checkIn?: string;
    checkOut?: string;
  }>;
};

export default async function BookingSuccessPage({
  searchParams,
}: BookingSuccessPageProps) {
  const params = await searchParams;

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
      <div className="rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a6f46]">
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
          <SummaryItem label="Booking number" value={params?.booking ?? "-"} />
          <SummaryItem label="Room type" value={params?.roomType ?? "-"} />
          <SummaryItem
            label="Check-in"
            value={params?.checkIn ? formatPublicDate(params.checkIn) : "-"}
          />
          <SummaryItem
            label="Check-out"
            value={params?.checkOut ? formatPublicDate(params.checkOut) : "-"}
          />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            className="rounded-full bg-[#172033] px-5 py-3 text-sm font-semibold text-white"
            href="/"
          >
            Back home
          </Link>
          <Link
            className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-[#172033]"
            href="/rooms"
          >
            View rooms
          </Link>
        </div>
      </div>
    </section>
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
