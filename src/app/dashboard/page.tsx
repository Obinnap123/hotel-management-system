import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { getDashboardOverview } from "@/features/dashboard/queries";
import type { BookingStatusValue } from "@/lib/domain/hms-enums";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

export default async function DashboardPage() {
  const overview = await getDashboardOverview();

  return (
    <DashboardOverview
      activeStays={overview.activeStays.map(mapBooking)}
      recentPayments={overview.recentPayments.map((payment) => ({
        id: payment.id,
        bookingNumber: formatBookingNumber(payment.bookingId),
        guestName: payment.booking.guest.fullName,
        roomNumber: payment.booking.room.roomNumber,
        amount: payment.amount.toString(),
        method: payment.method,
        paymentDate: dateFormatter.format(payment.paymentDate),
        recordedBy: payment.recordedBy.fullName,
      }))}
      stats={overview.stats}
      todaysArrivals={overview.todaysArrivals.map(mapBooking)}
      todaysDepartures={overview.todaysDepartures.map(mapBooking)}
    />
  );
}

function mapBooking(booking: {
  id: string;
  status: BookingStatusValue;
  checkInDate: Date;
  checkOutDate: Date;
  guest: {
    fullName: string;
  };
  room: {
    roomNumber: string;
    roomType: {
      name: string;
    };
  };
}) {
  return {
    id: booking.id,
    bookingNumber: formatBookingNumber(booking.id),
    guestName: booking.guest.fullName,
    roomNumber: booking.room.roomNumber,
    roomTypeName: booking.room.roomType.name,
    status: booking.status,
    checkInDate: dateFormatter.format(booking.checkInDate),
    checkOutDate: dateFormatter.format(booking.checkOutDate),
  };
}

function formatBookingNumber(id: string) {
  return `BK-${id.slice(-6).toUpperCase()}`;
}
