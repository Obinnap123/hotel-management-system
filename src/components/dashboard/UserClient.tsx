"use client";

import {
  Edit,
  Eye,
  Lock,
  Plus,
  RotateCcw,
  Search,
  Unlock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type KeyboardEvent,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useFormStatus } from "react-dom";
import {
  activateUserAction,
  createUserAction,
  deactivateUserAction,
  resetPasswordAction,
  updateUserAction,
  type ResetPasswordActionState,
  type UserActionState,
} from "@/features/users/actions";
import {
  type UserRoleValue,
  type UserStatusValue,
} from "@/lib/domain/hms-enums";
import { UserDetailsModal } from "@/components/dashboard/UserDetailsModal";
import { AutoDismissMessage } from "@/components/ui/AutoDismissMessage";
import { Modal } from "@/components/ui/Modal";

export type StaffTableItem = {
  id: string;
  fullName: string;
  email: string;
  role: UserRoleValue;
  status: UserStatusValue;
  createdAt: string;
  bookingsCreatedCount: number;
  paymentsRecordedCount: number;
  guestsCheckedInCount: number;
  guestsCheckedOutCount: number;
};

type UserClientProps = {
  users: StaffTableItem[];
  notice?: string;
  error?: string;
};

const initialActionState: UserActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

const initialResetState: ResetPasswordActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

export function UserClient({ users, notice, error }: UserClientProps) {
  const [search, setSearch] = useState("");
  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        user.fullName.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.role.toLowerCase().includes(normalizedSearch) ||
        user.status.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [search, users]);

  return (
    <div className="min-w-0 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-950">Users</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Manage internal hotel staff accounts and access.
          </p>
        </div>

        <CreateUserDialog />
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
        <label className="relative block max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            className="h-10 w-full rounded-md border border-zinc-300 pl-9 pr-3 text-sm outline-none focus:border-zinc-900"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search staff, email, role, or status"
            type="search"
            value={search}
          />
        </label>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:hidden">
          {filteredUsers.map((user) => (
            <div
              className="rounded-md border border-zinc-200 p-3"
              key={user.id}
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words font-medium text-zinc-950">
                    {user.fullName}
                  </p>
                  <p className="mt-1 break-words text-sm text-zinc-600">
                    {user.email}
                  </p>
                </div>
                <UserStatusBadge status={user.status} />
              </div>

              <div className="mt-3 space-y-1 text-sm text-zinc-600">
                <p>{user.role}</p>
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Created {user.createdAt}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <UserDetailsModal
                  user={user}
                  trigger={
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-50"
                      title="View staff details"
                      type="button"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View staff</span>
                    </button>
                  }
                />
                <EditUserDialog user={user} />
                <ActivationDialog user={user} />
                <ResetPasswordDialog user={user} />
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No staff accounts match your search.
            </p>
          ) : null}
        </div>

        <div className="dashboard-table-scroll mt-4 hidden lg:block">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <th className="py-3 pr-4 font-medium">Full Name</th>
                <th className="py-3 pr-4 font-medium">Email</th>
                <th className="py-3 pr-4 font-medium">Role</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Created At</th>
                <th className="py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr className="border-b border-zinc-100" key={user.id}>
                  <td className="py-3 pr-4 font-medium text-zinc-950">
                    {user.fullName}
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">{user.email}</td>
                  <td className="py-3 pr-4 text-zinc-700">{user.role}</td>
                  <td className="py-3 pr-4">
                    <UserStatusBadge status={user.status} />
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    {user.createdAt}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <UserDetailsModal
                        user={user}
                        trigger={
                          <button
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-50"
                            title="View staff details"
                            type="button"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View staff</span>
                          </button>
                        }
                      />
                      <EditUserDialog user={user} />
                      <ActivationDialog user={user} />
                      <ResetPasswordDialog user={user} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No staff accounts match your search.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createUserAction,
    initialActionState,
  );
  useCloseOnSuccess(state, setOpen);

  return (
    <Modal
      title="Create staff account"
      description="Create an internal staff login account."
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800">
          <Plus className="h-4 w-4" />
          Create Staff
        </button>
      }
    >
      <UserForm action={formAction} pending={pending} state={state} />
    </Modal>
  );
}

function EditUserDialog({ user }: { user: StaffTableItem }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateUserAction.bind(null, user.id),
    initialActionState,
  );
  useCloseOnSuccess(state, setOpen);

  return (
    <Modal
      title={`Edit ${user.fullName}`}
      description="Update staff account details."
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-50"
          title="Edit staff"
          type="button"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit staff</span>
        </button>
      }
    >
      <UserForm
        action={formAction}
        pending={pending}
        state={state}
        user={user}
      />
    </Modal>
  );
}

function UserForm({
  action,
  pending,
  state,
  user,
}: {
  action: (payload: FormData) => void;
  pending: boolean;
  state: UserActionState;
  user?: StaffTableItem;
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
          defaultValue={user?.fullName}
          name="fullName"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-800">Email</span>
        <input
          className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          defaultValue={user?.email}
          name="email"
          required
          type="email"
        />
      </label>

      {!user ? (
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Password</span>
          <input
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
            minLength={8}
            name="password"
            required
            type="password"
          />
        </label>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Role</span>
          <select
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
            defaultValue={user?.role ?? "RECEPTIONIST"}
            name="role"
            required
          >
            <option value="ADMIN">ADMIN</option>
            <option value="RECEPTIONIST">RECEPTIONIST</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Status</span>
          <select
            className="mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
            defaultValue={user?.status ?? "ACTIVE"}
            name="status"
            required
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </label>
      </div>

      <button
        className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={pending}
        type="submit"
      >
        {pending ? "Saving. . ." : "Save"}
      </button>
    </form>
  );
}

function ActivationDialog({ user }: { user: StaffTableItem }) {
  const [open, setOpen] = useState(false);
  const isActive = user.status === "ACTIVE";
  const action = isActive ? deactivateUserAction : activateUserAction;
  const title = isActive
    ? `Deactivate ${user.fullName}?`
    : `Activate ${user.fullName}?`;
  const description = isActive
    ? "This user will no longer be able to login."
    : "This user will regain access to the system.";
  const label = isActive ? "Deactivate" : "Activate";
  const Icon = isActive ? Lock : Unlock;

  return (
    <Modal
      title={title}
      description={description}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-50"
          title={label}
          type="button"
        >
          <Icon className="h-4 w-4" />
          <span className="sr-only">{label}</span>
        </button>
      }
    >
      <form action={action} className="space-y-5">
        <input name="userId" type="hidden" value={user.id} />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            onClick={() => setOpen(false)}
            type="button"
          >
            Cancel
          </button>
          <ActivationSubmitButton label={label} />
        </div>
      </form>
    </Modal>
  );
}

function ActivationSubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      disabled={pending}
      type="submit"
    >
      {pending ? getActivationPendingLabel(label) : label}
    </button>
  );
}

function getActivationPendingLabel(label: string) {
  return label === "Deactivate" ? "Deactivating. . ." : "Activating. . .";
}

function ResetPasswordDialog({ user }: { user: StaffTableItem }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    resetPasswordAction.bind(null, user.id),
    initialResetState,
  );

  return (
    <Modal
      title={`Reset password for ${user.fullName}?`}
      description="A temporary password will be generated."
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          title="Reset password"
          type="button"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Password
        </button>
      }
    >
      <form action={formAction} className="space-y-5">
        {state.message ? (
          <AutoDismissMessage variant={state.ok ? "success" : "error"}>
            {state.message}
          </AutoDismissMessage>
        ) : null}

        {state.temporaryPassword ? (
          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Temporary Password
            </p>
            <p className="mt-2 font-mono text-lg font-semibold text-zinc-950">
              {state.temporaryPassword}
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Please share this password securely with the staff member.
            </p>
          </div>
        ) : (
          <p className="text-sm text-zinc-700">
            The existing password will never be shown.
          </p>
        )}

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
            {pending ? "Resetting. . ." : "Reset Password"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function UserStatusBadge({ status }: { status: UserStatusValue }) {
  const styles: Record<UserStatusValue, string> = {
    ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
    INACTIVE: "border-zinc-300 bg-zinc-100 text-zinc-700",
  };

  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function useCloseOnSuccess(
  state: UserActionState,
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
