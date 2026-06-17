import { BookingStatus } from "@prisma/client";
import { markRoomAvailable } from "@/features/rooms/status";
import { prisma } from "@/server/db/prisma";

export class CheckOutRuleError extends Error {}

export async function checkOutBooking(bookingId: string, checkedOutById: string) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new CheckOutRuleError("Booking was not found.");
    }

    if (booking.status !== BookingStatus.CHECKED_IN) {
      throw new CheckOutRuleError(
        "Only checked-in bookings can be checked out.",
      );
    }

    if (!booking.checkedInAt) {
      throw new CheckOutRuleError("This guest has not been checked in yet.");
    }

    if (booking.checkedOutAt) {
      throw new CheckOutRuleError("This booking has already been checked out.");
    }

    const staff = await tx.user.findUnique({
      where: { id: checkedOutById },
    });

    if (!staff) {
      throw new CheckOutRuleError("The staff account was not found.");
    }

    const checkedOutBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CHECKED_OUT,
        checkedOutAt: new Date(),
        checkedOutById,
      },
    });

    await markRoomAvailable(booking.roomId, tx);

    return checkedOutBooking;
  });
}
