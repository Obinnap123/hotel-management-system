"use client";

import { Save, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { AutoDismissMessage } from "@/components/ui/AutoDismissMessage";
import {
  updateHotelPolicySettingsAction,
  type SettingsActionState,
} from "@/features/settings/actions";
import { hotelPolicyLimits, type HotelPolicies } from "@/lib/hotel-policies";
import { notifyReservationSiteUpdated } from "@/lib/public/site-refresh";
import { SettingsField, settingsInputClass } from "./SettingsField";
import { SettingsPageHeader } from "./SettingsPageHeader";
import { SettingsSectionNav } from "./SettingsSectionNav";
import type { HotelPolicySettingsValues } from "./settings-types";

const initialActionState: SettingsActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

export function HotelPolicySettingsForm({
  defaults,
  settings,
}: {
  defaults: HotelPolicies;
  settings: HotelPolicySettingsValues;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    updateHotelPolicySettingsAction,
    initialActionState,
  );

  useEffect(() => {
    if (!state.ok || !state.submissionId) return;
    notifyReservationSiteUpdated();
    router.refresh();
  }, [router, state.ok, state.submissionId]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-7">
      <SettingsPageHeader
        description="Set the rules guests can review before reserving and the terms they must accept when submitting a request."
        showBackLink
        title="Hotel policies"
      />
      <SettingsSectionNav active="/dashboard/settings/policies" />

      <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950">
        <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          Review this wording with the hotel before launch. These policies are
          shown publicly, and a copy is saved with each reservation when the
          guest accepts them.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        {state.message ? (
          <AutoDismissMessage
            instanceKey={state.submissionId}
            variant={state.ok ? "success" : "error"}
          >
            {state.message}
          </AutoDismissMessage>
        ) : null}

        <PolicyPanel
          description="Explain how guests should request a cancellation and how the hotel decides whether charges apply."
          title="Cancellations"
        >
          <PolicyField
            defaultValue={settings.cancellationPolicy}
            fallback={defaults.cancellationPolicy}
            label="Cancellation policy"
            limit={hotelPolicyLimits.cancellationPolicy}
            name="cancellationPolicy"
          />
        </PolicyPanel>

        <PolicyPanel
          description="Set expectations for arrival, identification, occupancy, and conduct during the stay."
          title="Arrival and stay"
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <PolicyField
              defaultValue={settings.checkInRequirements}
              fallback={defaults.checkInRequirements}
              label="Check-in requirements"
              limit={hotelPolicyLimits.checkInRequirements}
              name="checkInRequirements"
            />
            <PolicyField
              defaultValue={settings.houseRules}
              fallback={defaults.houseRules}
              label="Hotel or house rules"
              limit={hotelPolicyLimits.houseRules}
              name="houseRules"
            />
          </div>
        </PolicyPanel>

        <PolicyPanel
          description="This wording appears beside the required acceptance checkbox on the reservation form."
          title="Reservation agreement"
        >
          <PolicyField
            defaultValue={settings.reservationTerms}
            fallback={defaults.reservationTerms}
            label="Terms accepted when a reservation is submitted"
            limit={hotelPolicyLimits.reservationTerms}
            name="reservationTerms"
          />
        </PolicyPanel>

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
            disabled={pending}
            type="submit"
          >
            <Save aria-hidden="true" className="h-4 w-4" />
            {pending ? "Saving…" : "Save hotel policies"}
          </button>
        </div>
      </form>
    </div>
  );
}

function PolicyPanel({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
      <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </section>
  );
}

function PolicyField({
  defaultValue,
  fallback,
  label,
  limit,
  name,
}: {
  defaultValue: string;
  fallback: string;
  label: string;
  limit: number;
  name: keyof HotelPolicySettingsValues;
}) {
  return (
    <SettingsField
      hint={`Leave blank to use the recommended wording shown as the example. Maximum ${limit.toLocaleString()} characters.`}
      label={label}
    >
      <textarea
        className={`${settingsInputClass} min-h-40 resize-y py-3 leading-6`}
        defaultValue={defaultValue}
        maxLength={limit}
        name={name}
        placeholder={fallback}
      />
    </SettingsField>
  );
}
