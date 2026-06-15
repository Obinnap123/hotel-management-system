import { BookingClient } from "@/components/dashboard/BookingClient";
import {
  getBookingFormOptions,
  getBookings,
} from "@/features/bookings/queries";

type BookingsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

const successMessages: Record<string, string> = {
  "booking-cancelled": "Booking cancelled.",
};

export default async function BookingsPage({
  searchParams,
}: BookingsPageProps) {
  const [bookings, options, params] = await Promise.all([
    getBookings(),
    getBookingFormOptions(),
    searchParams,
  ]);
  const notice = params?.success ? successMessages[params.success] : undefined;
  const error = params?.error ? decodeURIComponent(params.error) : undefined;

  return (
    <BookingClient
      bookings={bookings.map((booking) => ({
        id: booking.id,
        guestId: booking.guestId,
        guestName: booking.guest.fullName,
        roomId: booking.roomId,
        roomNumber: booking.room.roomNumber,
        roomTypeName: booking.room.roomType.name,
        checkInDate: dateFormatter.format(booking.checkInDate),
        checkOutDate: dateFormatter.format(booking.checkOutDate),
        totalAmount: booking.totalAmount.toString(),
        checkInInput: toDateInputValue(booking.checkInDate),
        checkOutInput: toDateInputValue(booking.checkOutDate),
        status: booking.status,
        createdAt: dateFormatter.format(booking.createdAt),
      }))}
      error={error}
      guests={options.guests.map((guest) => ({
        id: guest.id,
        fullName: guest.fullName,
        phoneNumber: guest.phoneNumber,
      }))}
      notice={notice}
      rooms={options.rooms.map((room) => ({
        id: room.id,
        roomNumber: room.roomNumber,
        roomTypeName: room.roomType.name,
      }))}
    />
  );
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}
