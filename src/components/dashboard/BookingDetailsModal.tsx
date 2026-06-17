"use client";

import type { ReactNode } from "react";
import type { BookingTableItem } from "@/components/dashboard/BookingClient";
import { Modal } from "@/components/ui/Modal";

type BookingDetailsModalProps = {
  booking: BookingTableItem;
  trigger: ReactNode;
};

export function BookingDetailsModal({
  booking,
  trigger,
}: BookingDetailsModalProps) {
  return (
    <Modal
      title={`Booking ${formatBookingNumber(booking.id)}`}
      description="Read-only booking lifecycle details."
      trigger={trigger}
    >
      <div className="space-y-5">
        <DetailSection title="Booking Summary">
          <DetailItem label="Booking" value={formatBookingNumber(booking.id)} />
          <DetailItem label="Status" value={booking.status.replace("_", " ")} />
          <DetailItem label="Check In" value={booking.checkInDate} />
          <DetailItem label="Check Out" value={booking.checkOutDate} />
          <DetailItem
            label="Total Amount"
            value={formatCurrency(booking.totalAmount)}
          />
          <DetailItem label="Created By" value={booking.createdByName} />
          <DetailItem label="Created At" value={booking.createdAtFull} />
        </DetailSection>

        <DetailSection title="Guest Details">
          <DetailItem label="Full Name" value={booking.guestName} />
          <DetailItem label="Phone Number" value={booking.guestPhoneNumber} />
          <DetailItem
            label="Email"
            value={booking.guestEmail ?? "Not provided"}
          />
          <DetailItem
            label="Address"
            value={booking.guestAddress ?? "Not provided"}
          />
        </DetailSection>

        <DetailSection title="Room Details">
          <DetailItem label="Room Number" value={booking.roomNumber} />
          <DetailItem label="Room Type" value={booking.roomTypeName} />
          <DetailItem
            label="Price Per Night"
            value={formatCurrency(booking.roomPricePerNight)}
          />
          <DetailItem label="Capacity" value={`${booking.roomCapacity}`} />
          <DetailItem label="Current Status" value={booking.roomStatus} />
        </DetailSection>

        <DetailSection title="Payment Details">
          {booking.paymentAmount ? (
            <>
              <DetailItem
                label="Amount"
                value={formatCurrency(booking.paymentAmount)}
              />
              <DetailItem
                label="Payment Method"
                value={booking.paymentMethod ?? "Not recorded"}
              />
              <DetailItem
                label="Payment Date"
                value={booking.paymentDate ?? "Not recorded"}
              />
              <DetailItem
                label="Recorded By"
                value={booking.paymentRecordedByName ?? "Not recorded"}
              />
            </>
          ) : (
            <div className="sm:col-span-2">
              <p className="text-sm text-zinc-500">No payment recorded.</p>
            </div>
          )}
        </DetailSection>

        <DetailSection title="Check-In / Check-Out History">
          <DetailItem
            label="Checked In By"
            value={getLifecycleStaffLabel(
              booking.checkedInAt,
              booking.checkedInByName,
              "Not checked in yet",
            )}
          />
          <DetailItem
            label="Checked In At"
            value={booking.checkedInAt ?? "Not checked in yet"}
          />
          <DetailItem
            label="Checked Out By"
            value={getLifecycleStaffLabel(
              booking.checkedOutAt,
              booking.checkedOutByName,
              "Not checked out yet",
            )}
          />
          <DetailItem
            label="Checked Out At"
            value={booking.checkedOutAt ?? "Not checked out yet"}
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

function formatBookingNumber(id: string) {
  return `BK-${id.slice(-6).toUpperCase()}`;
}

function formatCurrency(value: string) {
  return `NGN ${Number(value).toLocaleString()}`;
}

function getLifecycleStaffLabel(
  lifecycleAt: string | null,
  staffName: string | null,
  emptyLabel: string,
) {
  if (staffName) {
    return staffName;
  }

  return lifecycleAt ? "Unknown staff" : emptyLabel;
}
