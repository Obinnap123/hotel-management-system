import Link from "next/link";
import { BookingForm } from "@/components/public/BookingForm";
import { getAllPublicRoomTypes } from "@/features/public-room-types/queries";

export const dynamic = "force-dynamic";

type PublicBookPageProps = {
  searchParams?: Promise<{
    checkInDate?: string;
    checkOutDate?: string;
    guestCount?: string;
    roomType?: string;
  }>;
};

export default async function PublicBookPage({
  searchParams,
}: PublicBookPageProps) {
  const [roomTypes, params] = await Promise.all([
    getAllPublicRoomTypes(),
    searchParams,
  ]);

  return (
    <section className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a6f46]">
          Reservation
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Reserve your stay
        </h1>
        <p className="mt-4 text-[#5f6b7a]">
          This page is ready for the public reservation form. The reservation
          logic already connects to the HMS workflow.
        </p>

        <BookingForm
          defaultCheckInDate={params?.checkInDate}
          defaultCheckOutDate={params?.checkOutDate}
          defaultGuestCount={params?.guestCount}
          defaultRoomTypeSlug={params?.roomType}
          roomTypes={roomTypes}
        />

        <Link
          className="mt-6 inline-flex rounded-full bg-[#172033] px-5 py-3 text-sm font-semibold text-white"
          href="/rooms"
        >
          Back to rooms
        </Link>
      </div>
    </section>
  );
}
