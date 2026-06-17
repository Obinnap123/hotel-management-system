import { BookingStatus } from "@prisma/client";
import { markRoomOccupied } from "@/features/rooms/status";
import { prisma } from "@/server/db/prisma";

export class CheckInRuleError extends Error {}

export async function checkInBooking(bookingId: string, checkedInById: string) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: {
        payment: true,
      },
    });

    if (!booking) {
      throw new CheckInRuleError("Booking was not found.");
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new CheckInRuleError(
        "Only confirmed bookings can be checked in.",
      );
    }

    if (!booking.payment) {
      throw new CheckInRuleError("Unpaid bookings cannot be checked in.");
    }

    if (booking.checkedInAt) {
      throw new CheckInRuleError("This booking has already been checked in.");
    }

    const staff = await tx.user.findUnique({
      where: { id: checkedInById },
    });

    if (!staff) {
      throw new CheckInRuleError("The staff account was not found.");
    }

    const checkedInBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CHECKED_IN,
        checkedInAt: new Date(),
        checkedInById,
      },
    });

    await markRoomOccupied(booking.roomId, tx);

    return checkedInBooking;
  });
}
