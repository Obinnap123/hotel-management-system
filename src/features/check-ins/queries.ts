import { BookingStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export async function getBookingsReadyForCheckIn() {
  return prisma.booking.findMany({
    where: {
      status: BookingStatus.CONFIRMED,
      checkedInAt: null,
      payment: {
        isNot: null,
      },
    },
    include: {
      guest: true,
      payment: true,
      room: {
        include: {
          roomType: true,
        },
      },
    },
    orderBy: {
      checkInDate: "asc",
    },
  });
}
