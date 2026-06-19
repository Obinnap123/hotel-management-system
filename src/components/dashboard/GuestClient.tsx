"use client";

import { Edit, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type KeyboardEvent,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createGuestAction,
  updateGuestAction,
  type GuestActionState,
} from "@/features/guests/actions";
import { AutoDismissMessage } from "@/components/ui/AutoDismissMessage";
import { Modal } from "@/components/ui/Modal";

export type GuestTableItem = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  address: string | null;
  createdAt: string;
};

type GuestClientProps = {
  guests: GuestTableItem[];
};

const initialActionState: GuestActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

export function GuestClient({ guests }: GuestClientProps) {
  const [search, setSearch] = useState("");
  const filteredGuests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return guests.filter((guest) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        guest.fullName.toLowerCase().includes(normalizedSearch) ||
        guest.phoneNumber.toLowerCase().includes(normalizedSearch) ||
        (guest.email?.toLowerCase().includes(normalizedSearch) ?? false)
      );
    });
  }, [guests, search]);

  return (
    <div className="min-w-0 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-950">Guests</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Create, edit, and search hotel guest records.
          </p>
        </div>

        <CreateGuestDialog />
      </div>

      <section className="min-w-0 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <label className="relative block max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            className="h-10 w-full rounded-md border border-zinc-300 pl-9 pr-3 text-sm outline-none focus:border-zinc-900"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, phone, or email"
            type="search"
            value={search}
          />
        </label>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:hidden">
          {filteredGuests.map((guest) => (
            <div
              className="rounded-md border border-zinc-200 p-3"
              key={guest.id}
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words font-medium text-zinc-950">
                    {guest.fullName}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {guest.phoneNumber}
                  </p>
                </div>
                <EditGuestDialog guest={guest} />
              </div>
              <div className="mt-3 space-y-1 text-sm text-zinc-600">
                <p className="break-words">{guest.email || "No email"}</p>
                <p className="break-words">{guest.address || "No address"}</p>
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Created {guest.createdAt}
                </p>
              </div>
            </div>
          ))}

          {filteredGuests.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No guests match your search.
            </p>
          ) : null}
        </div>

        <div className="dashboard-table-scroll mt-4 hidden lg:block">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <th className="py-3 pr-4 font-medium">Full Name</th>
                <th className="py-3 pr-4 font-medium">Phone Number</th>
                <th className="py-3 pr-4 font-medium">Email</th>
                <th className="py-3 pr-4 font-medium">Address</th>
                <th className="py-3 pr-4 font-medium">Date Created</th>
                <th className="py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((guest) => (
                <tr className="border-b border-zinc-100" key={guest.id}>
                  <td className="py-3 pr-4 font-medium text-zinc-950">
                    {guest.fullName}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {guest.phoneNumber}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {guest.email || "No email"}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {guest.address || "No address"}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {guest.createdAt}
                  </td>
                  <td className="py-3 text-right">
                    <EditGuestDialog guest={guest} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredGuests.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No guests match your search.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function CreateGuestDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createGuestAction,
    initialActionState,
  );
  useCloseOnSuccess(state, setOpen);

  return (
    <Modal
      title="Create guest"
      description="Add a guest record for hotel operations."
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800">
          <Plus className="h-4 w-4" />
          Create Guest
        </button>
      }
    >
      <GuestForm
        action={formAction}
        pending={pending}
        state={state}
        submitLabel="Save"
      />
    </Modal>
  );
}

function EditGuestDialog({ guest }: { guest: GuestTableItem }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateGuestAction.bind(null, guest.id),
    initialActionState,
  );
  useCloseOnSuccess(state, setOpen);

  return (
    <Modal
      title={`Edit ${guest.fullName}`}
      description="Update guest details."
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-50">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit guest</span>
        </button>
      }
    >
      <GuestForm
        action={formAction}
        guest={guest}
        pending={pending}
        state={state}
        submitLabel="Save"
      />
    </Modal>
  );
}

function GuestForm({
  action,
  guest,
  pending,
  state,
  submitLabel,
}: {
  action: (payload: FormData) => void;
  guest?: GuestTableItem;
  pending: boolean;
  state: GuestActionState;
  submitLabel: string;
}) {
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
        <span className="text-sm font-medium text-zinc-800">Full name</span>
        <input
          className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          defaultValue={guest?.fullName}
          name="fullName"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Phone number</span>
        <input
          className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          defaultValue={guest?.phoneNumber}
          name="phoneNumber"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Email</span>
        <input
          className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          defaultValue={guest?.email ?? ""}
          name="email"
          type="email"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Address</span>
        <textarea
          className="mt-1 min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          defaultValue={guest?.address ?? ""}
          name="address"
        />
      </label>

      <button
        className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={pending}
        type="submit"
      >
        {pending ? "Saving. . ." : submitLabel}
      </button>
    </form>
  );
}

function useCloseOnSuccess(
  state: GuestActionState,
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
