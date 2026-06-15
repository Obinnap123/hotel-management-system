"use client";

import { LogIn, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { checkInBookingAction } from "@/features/check-ins/actions";

export type CheckInTableItem = {
  id: string;
  bookingNumber: string;
  guestName: string;
  roomNumber: string;
  roomTypeName: string;
  checkInDate: string;
  checkOutDate: string;
  amountPaid: string;
};

type CheckInClientProps = {
  bookings: CheckInTableItem[];
  notice?: string;
  error?: string;
};

export function CheckInClient({
  bookings,
  notice,
  error,
}: CheckInClientProps) {
  const [search, setSearch] = useState("");
  const filteredBookings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        booking.bookingNumber.toLowerCase().includes(normalizedSearch) ||
        booking.guestName.toLowerCase().includes(normalizedSearch) ||
        booking.roomNumber.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [bookings, search]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-950">Check-Ins</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Check in confirmed, paid bookings and mark rooms as occupied.
        </p>
      </div>

      {notice ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {notice}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <label className="relative block max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            className="h-10 w-full rounded-md border border-zinc-300 pl-9 pr-3 text-sm outline-none focus:border-zinc-900"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search booking, guest, or room"
            type="search"
            value={search}
          />
        </label>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <th className="py-3 pr-4 font-medium">Booking</th>
                <th className="py-3 pr-4 font-medium">Guest</th>
                <th className="py-3 pr-4 font-medium">Room</th>
                <th className="py-3 pr-4 font-medium">Room Type</th>
                <th className="py-3 pr-4 font-medium">Check In</th>
                <th className="py-3 pr-4 font-medium">Check Out</th>
                <th className="py-3 pr-4 font-medium">Amount Paid</th>
                <th className="py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr className="border-b border-zinc-100" key={booking.id}>
                  <td className="py-3 pr-4 font-medium text-zinc-950">
                    {booking.bookingNumber}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {booking.guestName}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {booking.roomNumber}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {booking.roomTypeName}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {booking.checkInDate}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {booking.checkOutDate}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    NGN {Number(booking.amountPaid).toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <form action={checkInBookingAction}>
                      <input name="bookingId" type="hidden" value={booking.id} />
                      <button
                        className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                        type="submit"
                      >
                        <LogIn className="h-4 w-4" />
                        Check In
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No bookings are ready for check-in.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
