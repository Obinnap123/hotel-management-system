"use client";

import type { ReactNode } from "react";
import type { StaffTableItem } from "@/components/dashboard/UserClient";
import { Modal } from "@/components/ui/Modal";

type UserDetailsModalProps = {
  user: StaffTableItem;
  trigger: ReactNode;
};

export function UserDetailsModal({ user, trigger }: UserDetailsModalProps) {
  return (
    <Modal
      title={user.fullName}
      description="Read-only staff account and activity summary."
      trigger={trigger}
    >
      <div className="space-y-5">
        <DetailSection title="Staff Information">
          <DetailItem label="Full Name" value={user.fullName} />
          <DetailItem label="Email" value={user.email} />
          <DetailItem label="Role" value={user.role} />
          <DetailItem label="Status" value={user.status} />
          <DetailItem label="Created At" value={user.createdAt} />
        </DetailSection>

        <DetailSection title="Activity Summary">
          <DetailItem
            label="Bookings Created"
            value={`${user.bookingsCreatedCount}`}
          />
          <DetailItem
            label="Payments Recorded"
            value={`${user.paymentsRecordedCount}`}
          />
          <DetailItem
            label="Guests Checked In"
            value={`${user.guestsCheckedInCount}`}
          />
          <DetailItem
            label="Guests Checked Out"
            value={`${user.guestsCheckedOutCount}`}
          />
        </DetailSection>
      </div>
    </Modal>
  );
}

function DetailSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="border-t border-zinc-200 pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </h3>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-medium text-zinc-900">
        {value}
      </dd>
    </div>
  );
}
