"use client";

import { ChevronDown, KeyRound, LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/app/login/actions";
import type { AppRole } from "@/lib/auth/permissions";
import { ChangePasswordModal } from "@/components/layout/ChangePasswordModal";
import { Modal } from "@/components/ui/Modal";

type AccountMenuProps = {
  fullName: string;
  email: string;
  role: AppRole;
};

export function AccountMenu({ email, fullName, role }: AccountMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative max-w-full">
      <button
        className="inline-flex h-10 max-w-full items-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <UserRound className="h-4 w-4" />
        <span className="min-w-0 truncate">{fullName}</span>
        <ChevronDown className="h-4 w-4 text-zinc-500" />
      </button>

      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-[min(16rem,calc(100vw-2rem))] rounded-md border border-zinc-200 bg-white p-2 shadow-lg">
          <div className="border-b border-zinc-100 px-3 py-2">
            <p className="break-words font-medium text-zinc-950">{fullName}</p>
            <p className="mt-1 break-words text-xs text-zinc-500">{role}</p>
          </div>

          <div className="py-1">
            <MyAccountModal
              email={email}
              fullName={fullName}
              role={role}
              trigger={
                <button
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-50"
                  type="button"
                >
                  <UserRound className="h-4 w-4" />
                  My Account
                </button>
              }
            />

            <ChangePasswordModal
              trigger={
                <button
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-50"
                  type="button"
                >
                  <KeyRound className="h-4 w-4" />
                  Change Password
                </button>
              }
            />

            <form action={logoutAction}>
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-700 transition hover:bg-red-50"
                type="submit"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MyAccountModal({
  email,
  fullName,
  role,
  trigger,
}: AccountMenuProps & {
  trigger: React.ReactNode;
}) {
  return (
    <Modal title="My Account" description="Your staff account details." trigger={trigger}>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Full Name
          </dt>
          <dd className="mt-1 text-sm font-medium text-zinc-950">{fullName}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Email
          </dt>
          <dd className="mt-1 break-words text-sm font-medium text-zinc-950">
            {email}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Role
          </dt>
          <dd className="mt-1 text-sm font-medium text-zinc-950">{role}</dd>
        </div>
      </dl>
    </Modal>
  );
}
