"use client";

import { LogOut, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { checkOutBookingAction } from "@/features/check-outs/actions";
import type { BookingStatusValue } from "@/lib/domain/hms-enums";
import { AutoDismissMessage } from "@/components/ui/AutoDismissMessage";
import { Modal } from "@/components/ui/Modal";

export type CheckOutTableItem = {
  id: string;
  bookingNumber: string;
  guestName: string;
  roomNumber: string;
  roomTypeName: string;
  checkInDate: string;
  plannedCheckOutDate: string;
  isEarlyCheckOut: boolean;
  status: BookingStatusValue;
};

type CheckOutClientProps = {
  bookings: CheckOutTableItem[];
  notice?: string;
  error?: string;
};

export function CheckOutClient({
  bookings,
  notice,
  error,
}: CheckOutClientProps) {
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
        <h2 className="text-2xl font-semibold text-zinc-950">Check-Outs</h2>
        <p className="mt-1 text-sm text-zinc-600">
          End active stays and make rooms available again.
        </p>
      </div>

      {notice ? (
        <AutoDismissMessage variant="success">
          {notice}
        </AutoDismissMessage>
      ) : null}

      {error ? (
        <AutoDismissMessage variant="error">
          {error}
        </AutoDismissMessage>
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

        <div className="dashboard-table-scroll mt-4">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <th className="py-3 pr-4 font-medium">Booking No</th>
                <th className="py-3 pr-4 font-medium">Guest</th>
                <th className="py-3 pr-4 font-medium">Room</th>
                <th className="py-3 pr-4 font-medium">Room Type</th>
                <th className="py-3 pr-4 font-medium">Check In Date</th>
                <th className="py-3 pr-4 font-medium">
                  Planned Check Out
                </th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 text-right font-medium">Actions</th>
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
                    {booking.plannedCheckOutDate}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="inline-flex h-7 items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 text-xs font-medium text-sky-700">
                      {booking.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <CheckOutDialog booking={booking} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No guests are currently checked in.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function CheckOutDialog({ booking }: { booking: CheckOutTableItem }) {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      title="Confirm checkout"
      description="Are you sure you want to check out this guest?"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          type="button"
        >
          <LogOut className="h-4 w-4" />
          Check Out
        </button>
      }
    >
      <form action={checkOutBookingAction} className="space-y-5">
        <input name="bookingId" type="hidden" value={booking.id} />

        <div className="grid gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Guest
            </p>
            <p className="mt-1 font-medium text-zinc-950">
              {booking.guestName}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Room
            </p>
            <p className="mt-1 font-medium text-zinc-950">
              {booking.roomNumber}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-zinc-700">
          {booking.isEarlyCheckOut ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
              This guest is checking out before the planned checkout date.
            </p>
          ) : null}
          <p>This action will:</p>
          <p>- Mark booking as CHECKED_OUT</p>
          <p>- Mark room as AVAILABLE</p>
          <p>- Record checkout time</p>
          <p>- Record staff who performed checkout</p>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            onClick={() => setOpen(false)}
            type="button"
          >
            Cancel
          </button>
          <ConfirmCheckoutButton />
        </div>
      </form>
    </Modal>
  );
}

function ConfirmCheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      disabled={pending}
      type="submit"
    >
      <LogOut className="h-4 w-4" />
      {pending ? "Checking out. . ." : "Confirm Checkout"}
    </button>
  );
}
