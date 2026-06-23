"use client";

import { useActionState } from "react";
import {
  createPublicReservationAction,
  type PublicReservationActionState,
} from "@/features/public-reservations/actions";
import type { PublicRoomTypeSummary } from "@/features/public-room-types/queries";

type BookingFormProps = {
  roomTypes: PublicRoomTypeSummary[];
  defaultRoomTypeSlug?: string;
  defaultCheckInDate?: string;
  defaultCheckOutDate?: string;
  defaultGuestCount?: string;
};

const initialState: PublicReservationActionState = {
  ok: false,
  message: "",
};

export function BookingForm({
  defaultCheckInDate,
  defaultCheckOutDate,
  defaultGuestCount,
  defaultRoomTypeSlug,
  roomTypes,
}: BookingFormProps) {
  const [state, formAction, pending] = useActionState(
    createPublicReservationAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {state.message ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <PublicField label="Full name" error={state.fieldErrors?.fullName?.[0]}>
          <input
            className="mt-1 h-11 w-full rounded-lg border border-black/15 px-3"
            name="fullName"
            required
          />
        </PublicField>
        <PublicField label="Email" error={state.fieldErrors?.email?.[0]}>
          <input
            className="mt-1 h-11 w-full rounded-lg border border-black/15 px-3"
            name="email"
            required
            type="email"
          />
        </PublicField>
        <PublicField
          label="Phone number"
          error={state.fieldErrors?.phoneNumber?.[0]}
        >
          <input
            className="mt-1 h-11 w-full rounded-lg border border-black/15 px-3"
            name="phoneNumber"
            required
          />
        </PublicField>
        <PublicField
          label="Room type"
          error={state.fieldErrors?.roomTypeSlug?.[0]}
        >
          <select
            className="mt-1 h-11 w-full rounded-lg border border-black/15 px-3"
            defaultValue={defaultRoomTypeSlug ?? ""}
            name="roomTypeSlug"
            required
          >
            <option value="">Select room type</option>
            {roomTypes.map((roomType) => (
              <option key={roomType.slug} value={roomType.slug}>
                {roomType.name}
              </option>
            ))}
          </select>
        </PublicField>
        <PublicField
          label="Check-in date"
          error={state.fieldErrors?.checkInDate?.[0]}
        >
          <input
            className="mt-1 h-11 w-full rounded-lg border border-black/15 px-3"
            defaultValue={defaultCheckInDate}
            name="checkInDate"
            required
            type="date"
          />
        </PublicField>
        <PublicField
          label="Check-out date"
          error={state.fieldErrors?.checkOutDate?.[0]}
        >
          <input
            className="mt-1 h-11 w-full rounded-lg border border-black/15 px-3"
            defaultValue={defaultCheckOutDate}
            name="checkOutDate"
            required
            type="date"
          />
        </PublicField>
        <PublicField
          label="Number of guests"
          error={state.fieldErrors?.guestCount?.[0]}
        >
          <input
            className="mt-1 h-11 w-full rounded-lg border border-black/15 px-3"
            defaultValue={defaultGuestCount ?? "1"}
            min={1}
            name="guestCount"
            required
            type="number"
          />
        </PublicField>
      </div>

      <PublicField
        label="Special requests"
        error={state.fieldErrors?.specialRequests?.[0]}
      >
        <textarea
          className="mt-1 min-h-28 w-full rounded-lg border border-black/15 px-3 py-2"
          name="specialRequests"
          placeholder="Airport pickup, late arrival, room preference..."
        />
      </PublicField>

      <button
        className="inline-flex h-12 items-center justify-center rounded-full bg-[#172033] px-6 text-sm font-semibold text-white hover:bg-[#24314a] disabled:cursor-not-allowed disabled:bg-[#8b93a1]"
        disabled={pending}
        type="submit"
      >
        {pending ? "Reserving..." : "Complete reservation"}
      </button>
    </form>
  );
}

function PublicField({
  children,
  error,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-sm text-red-700">{error}</span> : null}
    </label>
  );
}
