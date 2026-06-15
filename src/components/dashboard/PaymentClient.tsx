"use client";

import { PaymentMethod } from "@prisma/client";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type KeyboardEvent,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createPaymentAction,
  type PaymentActionState,
} from "@/features/payments/actions";
import { paymentMethodValues } from "@/features/payments/validation";
import { Modal } from "@/components/ui/Modal";

export type PaymentTableItem = {
  id: string;
  bookingNumber: string;
  guestName: string;
  roomNumber: string;
  amount: string;
  method: PaymentMethod;
  recordedBy: string;
  paymentDate: string;
};

export type PaymentBookingOption = {
  id: string;
  bookingNumber: string;
  guestName: string;
  roomNumber: string;
  roomTypeName: string;
  totalAmount: string;
  checkInDate: string;
  checkOutDate: string;
};

type PaymentClientProps = {
  payments: PaymentTableItem[];
  eligibleBookings: PaymentBookingOption[];
};

const initialActionState: PaymentActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

export function PaymentClient({
  payments,
  eligibleBookings,
}: PaymentClientProps) {
  const [search, setSearch] = useState("");
  const filteredPayments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return payments.filter((payment) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        payment.bookingNumber.toLowerCase().includes(normalizedSearch) ||
        payment.guestName.toLowerCase().includes(normalizedSearch) ||
        payment.roomNumber.toLowerCase().includes(normalizedSearch) ||
        payment.method.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [payments, search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-950">Payments</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Record physical payments and confirm pending bookings.
          </p>
        </div>

        <RecordPaymentDialog eligibleBookings={eligibleBookings} />
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <label className="relative block max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            className="h-10 w-full rounded-md border border-zinc-300 pl-9 pr-3 text-sm outline-none focus:border-zinc-900"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search booking, guest, room, or method"
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
                <th className="py-3 pr-4 font-medium">Amount</th>
                <th className="py-3 pr-4 font-medium">Method</th>
                <th className="py-3 pr-4 font-medium">Recorded By</th>
                <th className="py-3 pr-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr className="border-b border-zinc-100" key={payment.id}>
                  <td className="py-3 pr-4 font-medium text-zinc-950">
                    {payment.bookingNumber}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {payment.guestName}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {payment.roomNumber}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    NGN {Number(payment.amount).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {payment.method}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {payment.recordedBy}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {payment.paymentDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPayments.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No payments match your search.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function RecordPaymentDialog({
  eligibleBookings,
}: {
  eligibleBookings: PaymentBookingOption[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createPaymentAction,
    initialActionState,
  );
  useCloseOnSuccess(state, setOpen);

  return (
    <Modal
      title="Record payment"
      description="Record a full physical payment for a pending booking."
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800">
          <Plus className="h-4 w-4" />
          Record Payment
        </button>
      }
    >
      <PaymentForm
        eligibleBookings={eligibleBookings}
        pending={pending}
        state={state}
        action={formAction}
      />
    </Modal>
  );
}

function PaymentForm({
  action,
  eligibleBookings,
  pending,
  state,
}: {
  action: (payload: FormData) => void;
  eligibleBookings: PaymentBookingOption[];
  pending: boolean;
  state: PaymentActionState;
}) {
  const [bookingSearch, setBookingSearch] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const selectedBooking = eligibleBookings.find(
    (booking) => booking.id === selectedBookingId,
  );
  const filteredBookings = useMemo(() => {
    const normalizedSearch = bookingSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return eligibleBookings;
    }

    return eligibleBookings.filter(
      (booking) =>
        booking.bookingNumber.toLowerCase().includes(normalizedSearch) ||
        booking.guestName.toLowerCase().includes(normalizedSearch) ||
        booking.roomNumber.toLowerCase().includes(normalizedSearch),
    );
  }, [bookingSearch, eligibleBookings]);

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    submitOnEnter(event);
  }

  return (
    <form action={action} className="space-y-4" onKeyDown={handleKeyDown}>
      {state.message && !state.ok ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      ) : null}

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Find booking</span>
        <input
          className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          onChange={(event) => setBookingSearch(event.target.value)}
          placeholder="Search booking, guest, or room"
          type="search"
          value={bookingSearch}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Booking</span>
        <select
          className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          name="bookingId"
          onChange={(event) => setSelectedBookingId(event.target.value)}
          required
          value={selectedBookingId}
        >
          <option value="">Select pending booking</option>
          {filteredBookings.map((booking) => (
            <option key={booking.id} value={booking.id}>
              {booking.bookingNumber} - {booking.guestName} - Room{" "}
              {booking.roomNumber}
            </option>
          ))}
        </select>
      </label>

      {selectedBooking ? (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
          <p>
            Expected amount:{" "}
            <span className="font-semibold text-zinc-950">
              NGN {Number(selectedBooking.totalAmount).toLocaleString()}
            </span>
          </p>
          <p className="mt-1">
            Stay: {selectedBooking.checkInDate} to{" "}
            {selectedBooking.checkOutDate}
          </p>
        </div>
      ) : null}

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Amount</span>
        <input
          className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          defaultValue={selectedBooking?.totalAmount ?? ""}
          min="1"
          name="amount"
          required
          step="0.01"
          type="number"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">
          Payment method
        </span>
        <select
          className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          name="method"
          required
        >
          <option value="">Select method</option>
          {paymentMethodValues.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Payment date</span>
        <input
          className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          defaultValue={new Date().toISOString().slice(0, 10)}
          name="paymentDate"
          required
          type="date"
        />
      </label>

      <button
        className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={pending || eligibleBookings.length === 0}
        type="submit"
      >
        {pending ? "Saving. . ." : "Save"}
      </button>

      {eligibleBookings.length === 0 ? (
        <p className="text-sm text-amber-700">
          There are no pending unpaid bookings.
        </p>
      ) : null}
    </form>
  );
}

function useCloseOnSuccess(
  state: PaymentActionState,
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
