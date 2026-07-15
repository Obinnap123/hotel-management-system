"use client";

import { cloneElement, useActionState, useId } from "react";
import { LoaderCircle } from "lucide-react";
import { buttonStyles } from "@/components/ui/button-styles";
import { createDemoRequestAction, type DemoRequestActionState } from "@/features/demo-requests/actions";

const initialState: DemoRequestActionState = { ok: false, message: "" };
const controlClass = "mt-2 min-h-12 w-full border border-(--border) bg-(--surface) px-4 text-base text-(--text) shadow-(--shadow-sm) outline-none transition placeholder:text-(--text-muted) focus:border-(--brand-gold) focus:ring-3 focus:ring-(--focus-ring)";
const roles = ["Owner / Founder", "General Manager", "Operations Manager", "Front Desk Manager", "Consultant / Agency", "Other"];

export function RequestDemoForm() {
  const [state, formAction, pending] = useActionState(createDemoRequestAction, initialState);
  const formId = useId();

  return (
    <form action={formAction} aria-busy={pending} className="space-y-9">
      {state.message ? <div aria-live="polite" className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:bg-red-950/30 dark:text-red-200" role="alert">{state.message}</div> : null}

      <fieldset>
        <legend className="border-b border-(--border) pb-3 text-sm font-semibold text-(--text-strong)">Your details</legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field error={state.fieldErrors?.fullName?.[0]} id={`${formId}-name`} label="Full name"><input autoComplete="name" className={controlClass} name="fullName" required /></Field>
          <Field error={state.fieldErrors?.workEmail?.[0]} id={`${formId}-email`} label="Work email"><input autoComplete="email" className={controlClass} name="workEmail" required type="email" /></Field>
          <Field error={state.fieldErrors?.phoneNumber?.[0]} id={`${formId}-phone`} label="Phone number"><input autoComplete="tel" className={controlClass} inputMode="tel" name="phoneNumber" required /></Field>
          <Field error={state.fieldErrors?.role?.[0]} id={`${formId}-role`} label="Your role"><select className={controlClass} defaultValue="" name="role" required><option disabled value="">Select role</option>{roles.map((role) => <option key={role} value={role}>{role}</option>)}</select></Field>
        </div>
      </fieldset>

      <fieldset>
        <legend className="border-b border-(--border) pb-3 text-sm font-semibold text-(--text-strong)">Hotel profile</legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field error={state.fieldErrors?.hotelName?.[0]} id={`${formId}-hotel`} label="Hotel name"><input autoComplete="organization" className={controlClass} name="hotelName" required /></Field>
          <Field error={state.fieldErrors?.hotelLocation?.[0]} id={`${formId}-location`} label="Hotel location"><input autoComplete="address-level2" className={controlClass} name="hotelLocation" placeholder="City, State / Region" required /></Field>
          <Field error={state.fieldErrors?.numberOfRooms?.[0]} hint="An estimate is fine." id={`${formId}-rooms`} label="Number of rooms"><input className={controlClass} inputMode="numeric" min={1} name="numberOfRooms" required type="number" /></Field>
        </div>
      </fieldset>

      <Field error={state.fieldErrors?.additionalNotes?.[0]} hint="Optional" id={`${formId}-notes`} label="What would you like to improve?"><textarea className={`${controlClass} min-h-32 py-3`} name="additionalNotes" placeholder="For example: reservation tracking, staff coordination, payment visibility, or direct bookings." /></Field>

      <button className={buttonStyles({ className: "w-full rounded-none", size: "lg" })} disabled={pending} type="submit">
        {pending ? <><LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />Submitting request...</> : "Request Demo"}
      </button>
      <p className="text-center text-xs leading-5 text-(--text-muted)">By submitting, you are asking the SymplyUp team to contact you about the product and your hotel&apos;s requirements.</p>
    </form>
  );
}

function Field({ children, error, hint, id, label }: { children: React.ReactElement<{ id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean }>; error?: string; hint?: string; id: string; label: string }) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const control = cloneElement(children, {
    id,
    "aria-describedby": descriptionId,
    "aria-invalid": Boolean(error),
  });
  return <div><div className="flex items-baseline justify-between gap-3"><label className="text-sm font-semibold text-(--text-strong)" htmlFor={id}>{label}</label>{hint ? <span className="text-xs text-(--text-muted)" id={!error ? descriptionId : undefined}>{hint}</span> : null}</div>{control}{error ? <p className="mt-2 text-sm font-medium text-red-700 dark:text-red-300" id={descriptionId}>{error}</p> : null}</div>;
}
