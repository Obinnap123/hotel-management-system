"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { AutoDismissMessage } from "@/components/ui/AutoDismissMessage";
import {
  updateHotelProfileSettingsAction,
  type SettingsActionState,
} from "@/features/settings/actions";
import {
  formatCurrencyPreview,
  type CurrencyOption,
} from "@/lib/currency";
import { notifyReservationSiteUpdated } from "@/lib/public/site-refresh";
import { SettingsField, settingsInputClass } from "./SettingsField";
import { SettingsPageHeader } from "./SettingsPageHeader";
import { SettingsSectionNav } from "./SettingsSectionNav";
import type { HotelProfileSettingsValues } from "./settings-types";

const initialActionState: SettingsActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

export function HotelProfileSettingsForm({
  currencyOptions,
  settings,
}: {
  currencyOptions: CurrencyOption[];
  settings: HotelProfileSettingsValues;
}) {
  const router = useRouter();
  const [currency, setCurrency] = useState(settings.currency);
  const [state, formAction, pending] = useActionState(
    updateHotelProfileSettingsAction,
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
        description="Manage the identity and operating defaults used throughout the HMS and reservation experience."
        showBackLink
        title="Hotel profile"
      />
      <SettingsSectionNav active="/dashboard/settings/hotel-profile" />

      <form action={formAction} className="space-y-5">
        {state.message ? (
          <AutoDismissMessage variant={state.ok ? "success" : "error"}>
            {state.message}
          </AutoDismissMessage>
        ) : null}

        <SettingsPanel
          description="These details identify the hotel to staff and guests."
          title="Hotel information"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <SettingsField label="Hotel name">
              <input
                autoComplete="organization"
                className={settingsInputClass}
                defaultValue={settings.hotelName}
                name="hotelName"
                required
              />
            </SettingsField>
            <SettingsField label="Phone number">
              <input
                autoComplete="tel"
                className={settingsInputClass}
                defaultValue={settings.phoneNumber}
                name="phoneNumber"
                required
                type="tel"
              />
            </SettingsField>
            <SettingsField label="Email address">
              <input
                autoComplete="email"
                className={settingsInputClass}
                defaultValue={settings.emailAddress}
                name="emailAddress"
                required
                type="email"
              />
            </SettingsField>
            <SettingsField className="sm:col-span-2" label="Physical address">
              <textarea
                autoComplete="street-address"
                className={`${settingsInputClass} min-h-28 resize-y py-2.5 leading-6`}
                defaultValue={settings.physicalAddress}
                name="physicalAddress"
                required
              />
            </SettingsField>
          </div>
        </SettingsPanel>

        <SettingsPanel
          description="These defaults are used when staff create bookings and when monetary values are displayed."
          title="Operating defaults"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <SettingsField label="Default check-in time">
              <input
                className={settingsInputClass}
                defaultValue={settings.defaultCheckInTime}
                name="defaultCheckInTime"
                required
                type="time"
              />
            </SettingsField>
            <SettingsField label="Default check-out time">
              <input
                className={settingsInputClass}
                defaultValue={settings.defaultCheckOutTime}
                name="defaultCheckOutTime"
                required
                type="time"
              />
            </SettingsField>
            <SettingsField
              hint="Choose by currency name or symbol. The standard code is stored automatically."
              label="Currency"
            >
              <select
                className={settingsInputClass}
                name="currency"
                onChange={(event) => setCurrency(event.target.value)}
                required
                value={currency}
              >
                <optgroup label="Common currencies">
                  {currencyOptions
                    .filter((option) => option.common)
                    .map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.name} — {option.symbol} — {option.code}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="All supported currencies">
                  {currencyOptions
                    .filter((option) => !option.common)
                    .map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.name} — {option.symbol} — {option.code}
                      </option>
                    ))}
                </optgroup>
              </select>
              <span
                aria-live="polite"
                className="mt-2 block rounded-md bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600"
              >
                Room-price preview: {formatCurrencyPreview(currency)}
              </span>
            </SettingsField>
          </div>
        </SettingsPanel>

        <SaveBar
          pending={pending}
          text={pending ? "Saving…" : "Save hotel profile"}
        />
      </form>
    </div>
  );
}

function SettingsPanel({
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

function SaveBar({ pending, text }: { pending: boolean; text: string }) {
  return (
    <div className="flex justify-end border-t border-slate-200 pt-5">
      <button
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
        disabled={pending}
        type="submit"
      >
        <Save aria-hidden="true" className="h-4 w-4" />
        {text}
      </button>
    </div>
  );
}
