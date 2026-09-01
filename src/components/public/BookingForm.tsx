"use client";

import { useActionState, useId } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { createPublicReservationAction, type PublicReservationActionState } from "@/features/public-reservations/actions";
import type { PublicRoomTypeSummary } from "@/features/public-room-types/queries";

type BookingFormProps = { roomTypes: PublicRoomTypeSummary[]; defaultRoomTypeSlug?: string; defaultCheckInDate?: string; defaultCheckOutDate?: string; defaultGuestCount?: string };
const initialState: PublicReservationActionState = { ok: false, message: "" };

export function BookingForm({ defaultCheckInDate, defaultCheckOutDate, defaultGuestCount, defaultRoomTypeSlug, roomTypes }: BookingFormProps) {
  const [state, formAction, pending] = useActionState(createPublicReservationAction, initialState);
  const prefix = useId();

  return (
    <form action={formAction} className="mt-10 space-y-8">
      {state.message ? <div className="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">{state.message}</div> : null}

      <fieldset className="space-y-5">
        <legend className="mb-5 font-serif text-2xl text-[var(--reservation-ink)]">Your details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field error={state.fieldErrors?.fullName?.[0]} id={`${prefix}-name`} label="Full name"><input aria-describedby={state.fieldErrors?.fullName ? `${prefix}-name-error` : undefined} aria-invalid={Boolean(state.fieldErrors?.fullName)} autoComplete="name" className={controlClass} id={`${prefix}-name`} name="fullName" required /></Field>
          <Field error={state.fieldErrors?.email?.[0]} id={`${prefix}-email`} label="Email address"><input aria-describedby={state.fieldErrors?.email ? `${prefix}-email-error` : undefined} aria-invalid={Boolean(state.fieldErrors?.email)} autoComplete="email" className={controlClass} id={`${prefix}-email`} name="email" required type="email" /></Field>
          <Field className="sm:col-span-2" error={state.fieldErrors?.phoneNumber?.[0]} id={`${prefix}-phone`} label="Phone number"><input aria-describedby={state.fieldErrors?.phoneNumber ? `${prefix}-phone-error` : undefined} aria-invalid={Boolean(state.fieldErrors?.phoneNumber)} autoComplete="tel" className={controlClass} id={`${prefix}-phone`} inputMode="tel" name="phoneNumber" required type="tel" /></Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5 border-t border-[var(--reservation-line)] pt-8">
        <legend className="pr-4 font-serif text-2xl text-[var(--reservation-ink)]">Stay details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field className="sm:col-span-2" error={state.fieldErrors?.roomTypeSlug?.[0]} id={`${prefix}-room`} label="Room type"><select aria-describedby={state.fieldErrors?.roomTypeSlug ? `${prefix}-room-error` : undefined} aria-invalid={Boolean(state.fieldErrors?.roomTypeSlug)} className={controlClass} defaultValue={defaultRoomTypeSlug ?? ""} id={`${prefix}-room`} name="roomTypeSlug" required><option value="">Choose a room type</option>{roomTypes.map((roomType) => <option disabled={roomType.roomInventoryCount === 0} key={roomType.slug} value={roomType.slug}>{roomType.name}{roomType.roomInventoryCount === 0 ? " — contact reception" : ""}</option>)}</select></Field>
          <Field error={state.fieldErrors?.checkInDate?.[0]} id={`${prefix}-arrival`} label="Arrival"><input aria-describedby={state.fieldErrors?.checkInDate ? `${prefix}-arrival-error` : undefined} aria-invalid={Boolean(state.fieldErrors?.checkInDate)} className={controlClass} defaultValue={defaultCheckInDate} id={`${prefix}-arrival`} name="checkInDate" required type="date" /></Field>
          <Field error={state.fieldErrors?.checkOutDate?.[0]} id={`${prefix}-departure`} label="Departure"><input aria-describedby={state.fieldErrors?.checkOutDate ? `${prefix}-departure-error` : undefined} aria-invalid={Boolean(state.fieldErrors?.checkOutDate)} className={controlClass} defaultValue={defaultCheckOutDate} id={`${prefix}-departure`} name="checkOutDate" required type="date" /></Field>
          <Field error={state.fieldErrors?.guestCount?.[0]} id={`${prefix}-guests`} label="Number of guests"><input aria-describedby={state.fieldErrors?.guestCount ? `${prefix}-guests-error` : undefined} aria-invalid={Boolean(state.fieldErrors?.guestCount)} className={controlClass} defaultValue={defaultGuestCount ?? "1"} id={`${prefix}-guests`} min={1} name="guestCount" required type="number" /></Field>
        </div>
      </fieldset>

      <Field error={state.fieldErrors?.specialRequests?.[0]} hint="Optional" id={`${prefix}-requests`} label="Special requests"><textarea aria-describedby={state.fieldErrors?.specialRequests ? `${prefix}-requests-error` : undefined} aria-invalid={Boolean(state.fieldErrors?.specialRequests)} className={`${controlClass} min-h-28 py-3`} id={`${prefix}-requests`} name="specialRequests" placeholder="Arrival time, accessibility needs, or anything reception should know" /></Field>

      <button className="inline-flex h-13 w-full items-center justify-center gap-3 bg-[var(--reservation-primary)] px-6 text-xs font-bold uppercase tracking-[0.14em] text-[var(--reservation-on-primary)] transition hover:bg-[var(--reservation-primary-hover)] disabled:opacity-65" disabled={pending || roomTypes.length === 0} type="submit">{pending ? <><LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> Reserving your stay</> : <>Complete reservation <ArrowRight aria-hidden="true" className="h-4 w-4" /></>}</button>
      <p className="text-center text-xs leading-5 text-[var(--reservation-muted)]">Your reservation is sent directly to hotel reception. Payment and final room assignment are handled by hotel staff.</p>
    </form>
  );
}

function Field({ children, className = "", error, hint, id, label }: { children: React.ReactNode; className?: string; error?: string; hint?: string; id: string; label: string }) {
  const errorId = `${id}-error`;
  return <div className={className}><div className="flex items-baseline justify-between gap-3"><label className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--reservation-ink)]" htmlFor={id}>{label}</label>{hint ? <span className="text-xs text-[var(--reservation-muted)]">{hint}</span> : null}</div>{children}{error ? <p className="mt-2 text-sm text-red-700" id={errorId}>{error}</p> : null}</div>;
}

const controlClass = "mt-2 h-12 w-full border border-[var(--reservation-line)] bg-[var(--reservation-control)] px-3 text-sm outline-none transition focus:border-[var(--reservation-accent-copy)]";
