import { BookingStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export async function getBookingsReadyForCheckOut() {
  return prisma.booking.findMany({
    where: {
      status: BookingStatus.CHECKED_IN,
      checkedInAt: {
        not: null,
      },
      checkedOutAt: null,
    },
    include: {
      guest: true,
      room: {
        include: {
          roomType: true,
        },
      },
    },
    orderBy: {
      checkOutDate: "asc",
    },
  });
}
