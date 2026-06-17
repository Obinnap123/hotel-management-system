"use client";

import { useRouter } from "next/navigation";
import {
  type KeyboardEvent,
  useActionState,
  useEffect,
  useState,
} from "react";
import {
  changeOwnPasswordAction,
  type UserActionState,
} from "@/features/users/actions";
import { Modal } from "@/components/ui/Modal";

const initialActionState: UserActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

type ChangePasswordModalProps = {
  trigger: React.ReactNode;
};

export function ChangePasswordModal({ trigger }: ChangePasswordModalProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    changeOwnPasswordAction,
    initialActionState,
  );
  const router = useRouter();

  useEffect(() => {
    if (!state.ok) {
      return;
    }

    router.refresh();
  }, [router, state.ok, state.submissionId]);

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    event.currentTarget.requestSubmit();
  }

  return (
    <Modal
      title="Change Password"
      description="Update the password for your own staff account."
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
    >
      <form action={formAction} className="space-y-4" onKeyDown={handleKeyDown}>
        {state.message ? (
          <p
            className={`rounded-md border px-3 py-2 text-sm ${
              state.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {state.message}
          </p>
        ) : null}

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">
            Current Password
          </span>
          <input
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
            name="currentPassword"
            required
            type="password"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">
            New Password
          </span>
          <input
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
            minLength={8}
            name="newPassword"
            required
            type="password"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">
            Confirm Password
          </span>
          <input
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
            minLength={8}
            name="confirmPassword"
            required
            type="password"
          />
        </label>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            onClick={() => setOpen(false)}
            type="button"
          >
            Cancel
          </button>
          <button
            className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            disabled={pending}
            type="submit"
          >
            {pending ? "Saving. . ." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
