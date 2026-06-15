import { CheckInClient } from "@/components/dashboard/CheckInClient";
import { getBookingsReadyForCheckIn } from "@/features/check-ins/queries";

type CheckInsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

const successMessages: Record<string, string> = {
  "checked-in": "Guest checked in successfully.",
};

export default async function CheckInsPage({
  searchParams,
}: CheckInsPageProps) {
  const [bookings, params] = await Promise.all([
    getBookingsReadyForCheckIn(),
    searchParams,
  ]);
  const notice = params?.success ? successMessages[params.success] : undefined;
  const error = params?.error ? decodeURIComponent(params.error) : undefined;

  return (
    <CheckInClient
      bookings={bookings.map((booking) => ({
        id: booking.id,
        bookingNumber: formatBookingNumber(booking.id),
        guestName: booking.guest.fullName,
        roomNumber: booking.room.roomNumber,
        roomTypeName: booking.room.roomType.name,
        checkInDate: dateFormatter.format(booking.checkInDate),
        checkOutDate: dateFormatter.format(booking.checkOutDate),
        amountPaid: booking.payment?.amount.toString() ?? "0",
      }))}
      error={error}
      notice={notice}
    />
  );
}

function formatBookingNumber(id: string) {
  return `BK-${id.slice(-6).toUpperCase()}`;
}
