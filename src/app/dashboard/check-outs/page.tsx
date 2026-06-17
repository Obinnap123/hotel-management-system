import { CheckOutClient } from "@/components/dashboard/CheckOutClient";
import { getBookingsReadyForCheckOut } from "@/features/check-outs/queries";

type CheckOutsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

const successMessages: Record<string, string> = {
  "checked-out": "Guest checked out successfully.",
};

const errorMessages: Record<string, string> = {
  "checkout-failed": "Unable to check out guest. Please try again.",
  "invalid-booking": "Select a valid booking before checking out.",
};

export default async function CheckOutsPage({
  searchParams,
}: CheckOutsPageProps) {
  const todayStart = startOfDay(new Date());
  const [bookings, params] = await Promise.all([
    getBookingsReadyForCheckOut(),
    searchParams,
  ]);
  const notice = params?.success ? successMessages[params.success] : undefined;
  const error = params?.error
    ? errorMessages[params.error] ?? decodeURIComponent(params.error)
    : undefined;

  return (
    <CheckOutClient
      bookings={bookings.map((booking) => ({
        id: booking.id,
        bookingNumber: formatBookingNumber(booking.id),
        guestName: booking.guest.fullName,
        roomNumber: booking.room.roomNumber,
        roomTypeName: booking.room.roomType.name,
        checkInDate: dateFormatter.format(booking.checkInDate),
        plannedCheckOutDate: dateFormatter.format(booking.checkOutDate),
        isEarlyCheckOut: startOfDay(booking.checkOutDate) > todayStart,
        status: booking.status,
      }))}
      error={error}
      notice={notice}
    />
  );
}

function formatBookingNumber(id: string) {
  return `BK-${id.slice(-6).toUpperCase()}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
