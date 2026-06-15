import { BookingStatus, Prisma } from "@prisma/client";
import { markRoomReserved } from "@/features/rooms/status";
import { prisma } from "@/server/db/prisma";
import type { PaymentFormInput } from "./validation";
import { toDate } from "@/features/bookings/validation";

export class PaymentRuleError extends Error {}

export async function createPayment(
  input: PaymentFormInput,
  recordedById: string,
) {
  const paymentDate = toDate(input.paymentDate);

  if (!paymentDate) {
    throw new PaymentRuleError("Enter a valid payment date.");
  }

  return prisma.$transaction(async (tx) => {
    const staffUser = await tx.user.findUnique({
      where: { id: recordedById },
      select: { id: true },
    });

    if (!staffUser) {
      throw new PaymentRuleError("Payment recorder was not found.");
    }

    const booking = await tx.booking.findUnique({
      where: { id: input.bookingId },
      include: {
        payment: true,
      },
    });

    if (!booking) {
      throw new PaymentRuleError("Selected booking was not found.");
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new PaymentRuleError(
        "Payment can only be recorded for pending bookings.",
      );
    }

    if (booking.payment) {
      throw new PaymentRuleError("This booking already has a payment.");
    }

    const paymentAmount = new Prisma.Decimal(input.amount);

    if (!paymentAmount.equals(booking.totalAmount)) {
      throw new PaymentRuleError("Payment amount must equal booking amount.");
    }

    const payment = await tx.payment.create({
      data: {
        bookingId: input.bookingId,
        amount: paymentAmount,
        method: input.method,
        paymentDate,
        recordedById,
      },
    });

    await tx.booking.update({
      where: { id: input.bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
      },
    });

    await markRoomReserved(booking.roomId, tx);

    return payment;
  });
}
