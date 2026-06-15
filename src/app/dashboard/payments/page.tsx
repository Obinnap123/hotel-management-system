import { PaymentClient } from "@/components/dashboard/PaymentClient";
import {
  getPayments,
  getPendingBookingsEligibleForPayment,
} from "@/features/payments/queries";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

export default async function PaymentsPage() {
  const [payments, eligibleBookings] = await Promise.all([
    getPayments(),
    getPendingBookingsEligibleForPayment(),
  ]);

  return (
    <PaymentClient
      eligibleBookings={eligibleBookings.map((booking) => ({
        id: booking.id,
        bookingNumber: formatBookingNumber(booking.id),
        guestName: booking.guest.fullName,
        roomNumber: booking.room.roomNumber,
        roomTypeName: booking.room.roomType.name,
        totalAmount: booking.totalAmount.toString(),
        checkInDate: dateFormatter.format(booking.checkInDate),
        checkOutDate: dateFormatter.format(booking.checkOutDate),
      }))}
      payments={payments.map((payment) => ({
        id: payment.id,
        bookingNumber: formatBookingNumber(payment.booking.id),
        guestName: payment.booking.guest.fullName,
        roomNumber: payment.booking.room.roomNumber,
        amount: payment.amount.toString(),
        method: payment.method,
        recordedBy: payment.recordedBy.fullName,
        paymentDate: dateFormatter.format(payment.paymentDate),
      }))}
    />
  );
}

function formatBookingNumber(id: string) {
  return `BK-${id.slice(-6).toUpperCase()}`;
}
