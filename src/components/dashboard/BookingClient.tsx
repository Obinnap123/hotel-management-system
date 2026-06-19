"use client";

import { Edit, Eye, Plus, Search, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type KeyboardEvent,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  cancelBookingAction,
  createBookingAction,
  updateBookingAction,
  type BookingActionState,
} from "@/features/bookings/actions";
import {
  bookingStatusValues,
  editableBookingStatuses,
  type BookingStatusValue,
  type PaymentMethodValue,
  type RoomStatusValue,
} from "@/lib/domain/hms-enums";
import { BookingDetailsModal } from "@/components/dashboard/BookingDetailsModal";
import { AutoDismissMessage } from "@/components/ui/AutoDismissMessage";
import { Modal } from "@/components/ui/Modal";

export type BookingTableItem = {
  id: string;
  guestId: string;
  guestName: string;
  roomId: string;
  roomNumber: string;
  roomTypeName: string;
  roomPricePerNight: string;
  roomCapacity: number;
  roomStatus: RoomStatusValue;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: string;
  checkInInput: string;
  checkOutInput: string;
  status: BookingStatusValue;
  createdAt: string;
  createdAtFull: string;
  createdByName: string;
  guestPhoneNumber: string;
  guestEmail: string | null;
  guestAddress: string | null;
  paymentAmount: string | null;
  paymentMethod: PaymentMethodValue | null;
  paymentDate: string | null;
  paymentRecordedByName: string | null;
  checkedInAt: string | null;
  checkedInByName: string | null;
  checkedOutAt: string | null;
  checkedOutByName: string | null;
};

export type BookingGuestOption = {
  id: string;
  fullName: string;
  phoneNumber: string;
};

export type BookingRoomOption = {
  id: string;
  roomNumber: string;
  roomTypeName: string;
};

type BookingClientProps = {
  bookings: BookingTableItem[];
  guests: BookingGuestOption[];
  rooms: BookingRoomOption[];
  notice?: string;
  error?: string;
};

const editableStatusSet: ReadonlySet<BookingStatusValue> = new Set(
  editableBookingStatuses,
);

const initialActionState: BookingActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

export function BookingClient({
  bookings,
  guests,
  rooms,
  notice,
  error,
}: BookingClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const filteredBookings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        !normalizedSearch ||
        booking.guestName.toLowerCase().includes(normalizedSearch) ||
        booking.roomNumber.toLowerCase().includes(normalizedSearch);
      const matchesStatus =
        statusFilter === "ALL" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  return (
    <div className="min-w-0 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-950">Bookings</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Create reservations and keep room availability synchronized.
          </p>
        </div>

        <CreateBookingDialog guests={guests} rooms={rooms} />
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

      <section className="min-w-0 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="relative block md:w-96">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              className="h-10 w-full rounded-md border border-zinc-300 pl-9 pr-3 text-sm outline-none focus:border-zinc-900"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search guest or room"
              type="search"
              value={search}
            />
          </label>

          <select
            className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
            onChange={(event) => setStatusFilter(event.target.value)}
            value={statusFilter}
          >
            <option value="ALL">All statuses</option>
            {bookingStatusValues.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:hidden">
          {filteredBookings.map((booking) => (
            <div
              className="rounded-md border border-zinc-200 p-3"
              key={booking.id}
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words font-medium text-zinc-950">
                    {booking.guestName}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Room {booking.roomNumber} · {booking.roomTypeName}
                  </p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>

              <div className="mt-3 grid gap-1 text-sm text-zinc-600">
                <p>
                  {booking.checkInDate} to {booking.checkOutDate}
                </p>
                <p className="font-medium text-zinc-800">
                  NGN {Number(booking.totalAmount).toLocaleString()}
                </p>
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Created {booking.createdAt}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <BookingDetailsModal
                  booking={booking}
                  trigger={
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-50"
                      title="View booking details"
                      type="button"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View booking details</span>
                    </button>
                  }
                />
                <EditBookingDialog
                  booking={booking}
                  guests={guests}
                  rooms={rooms}
                />
                <CancelBookingForm booking={booking} />
              </div>
            </div>
          ))}

          {filteredBookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No bookings match your search.
            </p>
          ) : null}
        </div>

        <div className="dashboard-table-scroll mt-4 hidden lg:block">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <th className="py-3 pr-4 font-medium">Guest Name</th>
                <th className="py-3 pr-4 font-medium">Room Number</th>
                <th className="py-3 pr-4 font-medium">Room Type</th>
                <th className="py-3 pr-4 font-medium">Check In</th>
                <th className="py-3 pr-4 font-medium">Check Out</th>
                <th className="py-3 pr-4 font-medium">Total Amount</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Created At</th>
                <th className="py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr className="border-b border-zinc-100" key={booking.id}>
                  <td className="py-3 pr-4 font-medium text-zinc-950">
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
                    NGN {Number(booking.totalAmount).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">
                    <BookingStatusBadge status={booking.status} />
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {booking.createdAt}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <BookingDetailsModal
                        booking={booking}
                        trigger={
                          <button
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-50"
                            title="View booking details"
                            type="button"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">
                              View booking details
                            </span>
                          </button>
                        }
                      />
                      <EditBookingDialog
                        booking={booking}
                        guests={guests}
                        rooms={rooms}
                      />
                      <CancelBookingForm booking={booking} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No bookings match your search.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function CreateBookingDialog({
  guests,
  rooms,
}: {
  guests: BookingGuestOption[];
  rooms: BookingRoomOption[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createBookingAction,
    initialActionState,
  );
  useCloseOnSuccess(state, setOpen);

  return (
    <Modal
      title="New booking"
      description="Create a pending reservation for a guest and room."
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800">
          <Plus className="h-4 w-4" />
          New Booking
        </button>
      }
    >
      <BookingForm
        action={formAction}
        guests={guests}
        pending={pending}
        rooms={rooms}
        state={state}
      />
    </Modal>
  );
}

function EditBookingDialog({
  booking,
  guests,
  rooms,
}: {
  booking: BookingTableItem;
  guests: BookingGuestOption[];
  rooms: BookingRoomOption[];
}) {
  const canEdit = editableStatusSet.has(booking.status);
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateBookingAction.bind(null, booking.id),
    initialActionState,
  );
  useCloseOnSuccess(state, setOpen);

  return (
    <Modal
      title={`Edit booking for ${booking.guestName}`}
      description="Only pending and confirmed bookings can be edited."
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canEdit}
          type="button"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit booking</span>
        </button>
      }
    >
      <BookingForm
        action={formAction}
        booking={booking}
        guests={guests}
        pending={pending}
        rooms={rooms}
        state={state}
      />
    </Modal>
  );
}

function BookingForm({
  action,
  booking,
  guests,
  pending,
  rooms,
  state,
}: {
  action: (payload: FormData) => void;
  booking?: BookingTableItem;
  guests: BookingGuestOption[];
  pending: boolean;
  rooms: BookingRoomOption[];
  state: BookingActionState;
}) {
  const [guestSearch, setGuestSearch] = useState("");
  const filteredGuests = useMemo(() => {
    const normalizedSearch = guestSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return guests;
    }

    return guests.filter(
      (guest) =>
        guest.fullName.toLowerCase().includes(normalizedSearch) ||
        guest.phoneNumber.toLowerCase().includes(normalizedSearch),
    );
  }, [guestSearch, guests]);

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    submitOnEnter(event);
  }

  return (
    <form action={action} className="space-y-4" onKeyDown={handleKeyDown}>
      {state.message && !state.ok ? (
        <AutoDismissMessage variant="error">
          {state.message}
        </AutoDismissMessage>
      ) : null}

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Find guest</span>
        <input
          className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          onChange={(event) => setGuestSearch(event.target.value)}
          placeholder="Search by name or phone"
          type="search"
          value={guestSearch}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Guest</span>
        <select
          className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          defaultValue={booking?.guestId ?? ""}
          name="guestId"
          required
        >
          <option value="">Select guest</option>
          {filteredGuests.map((guest) => (
            <option key={guest.id} value={guest.id}>
              {guest.fullName} - {guest.phoneNumber}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Room</span>
        <select
          className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          defaultValue={booking?.roomId ?? ""}
          name="roomId"
          required
        >
          <option value="">Select room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.roomNumber} - {room.roomTypeName}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">
            Check-in date
          </span>
          <input
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
            defaultValue={booking?.checkInInput}
            name="checkInDate"
            required
            type="date"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">
            Check-out date
          </span>
          <input
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
            defaultValue={booking?.checkOutInput}
            name="checkOutDate"
            required
            type="date"
          />
        </label>
      </div>

      <button
        className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={pending || guests.length === 0 || rooms.length === 0}
        type="submit"
      >
        {pending ? "Saving. . ." : "Save"}
      </button>

      {guests.length === 0 || rooms.length === 0 ? (
        <p className="text-sm text-amber-700">
          Create at least one guest and one usable room before booking.
        </p>
      ) : null}
    </form>
  );
}

function CancelBookingForm({ booking }: { booking: BookingTableItem }) {
  const canCancel = editableStatusSet.has(booking.status);

  return (
    <form action={cancelBookingAction}>
      <input name="bookingId" type="hidden" value={booking.id} />
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!canCancel}
        title={
          canCancel
            ? "Cancel booking"
            : "Only pending or confirmed bookings can be cancelled"
        }
        type="submit"
      >
        <XCircle className="h-4 w-4" />
        <span className="sr-only">Cancel booking</span>
      </button>
    </form>
  );
}

function BookingStatusBadge({ status }: { status: BookingStatusValue }) {
  const styles: Record<BookingStatusValue, string> = {
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    CONFIRMED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    CHECKED_IN: "border-sky-200 bg-sky-50 text-sky-700",
    CHECKED_OUT: "border-zinc-300 bg-zinc-100 text-zinc-700",
    CANCELLED: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function useCloseOnSuccess(
  state: BookingActionState,
  setOpen: (open: boolean) => void,
) {
  const router = useRouter();

  useEffect(() => {
    if (!state.ok) {
      return;
    }

    setOpen(false);
    router.refresh();
  }, [router, setOpen, state.ok, state.submissionId]);
}

function submitOnEnter(event: KeyboardEvent<HTMLFormElement>) {
  if (event.key !== "Enter" || event.shiftKey) {
    return;
  }

  event.preventDefault();
  (event.currentTarget as HTMLFormElement).requestSubmit();
}
