"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";
import {
  updateSettingsAction,
  type SettingsActionState,
} from "@/features/settings/actions";
import { AutoDismissMessage } from "@/components/ui/AutoDismissMessage";

export type SettingsFormValues = {
  hotelName: string;
  phoneNumber: string;
  emailAddress: string;
  physicalAddress: string;
  defaultCheckInTime: string;
  defaultCheckOutTime: string;
  currency: string;
};

type SettingsClientProps = {
  settings: SettingsFormValues;
};

const initialActionState: SettingsActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

export function SettingsClient({ settings }: SettingsClientProps) {
  const [state, formAction, pending] = useActionState(
    updateSettingsAction,
    initialActionState,
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-950">Settings</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Manage hotel-wide information and operational policy defaults.
        </p>
      </div>

      <form
        action={formAction}
        className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
      >
        {state.message ? (
          <AutoDismissMessage variant={state.ok ? "success" : "error"}>
            {state.message}
          </AutoDismissMessage>
        ) : null}

        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Hotel Information
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-zinc-800">
                Hotel Name
              </span>
              <input
                className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
                defaultValue={settings.hotelName}
                name="hotelName"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-800">
                Phone Number
              </span>
              <input
                className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
                defaultValue={settings.phoneNumber}
                name="phoneNumber"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-800">
                Email Address
              </span>
              <input
                className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
                defaultValue={settings.emailAddress}
                name="emailAddress"
                required
                type="email"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-zinc-800">
                Physical Address
              </span>
              <textarea
                className="mt-1 min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                defaultValue={settings.physicalAddress}
                name="physicalAddress"
                required
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 border-t border-zinc-200 pt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Operational Settings
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-zinc-800">
                Default Check-In Time
              </span>
              <input
                className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
                defaultValue={settings.defaultCheckInTime}
                name="defaultCheckInTime"
                required
                type="time"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-800">
                Default Check-Out Time
              </span>
              <input
                className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
                defaultValue={settings.defaultCheckOutTime}
                name="defaultCheckOutTime"
                required
                type="time"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-800">
                Currency
              </span>
              <input
                className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm uppercase outline-none focus:border-zinc-900"
                defaultValue={settings.currency}
                maxLength={3}
                minLength={3}
                name="currency"
                required
              />
            </label>
          </div>
        </section>

        <div className="flex justify-end border-t border-zinc-200 pt-5">
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            disabled={pending}
            type="submit"
          >
            <Save className="h-4 w-4" />
            {pending ? "Saving. . ." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
