import { RoomStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export async function getBookings() {
  return prisma.booking.findMany({
    include: {
      guest: true,
      room: {
        include: {
          roomType: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getBookingFormOptions() {
  const [guests, rooms] = await Promise.all([
    prisma.guest.findMany({
      orderBy: {
        fullName: "asc",
      },
    }),
    prisma.room.findMany({
      where: {
        status: {
          not: RoomStatus.MAINTENANCE,
        },
      },
      include: {
        roomType: true,
      },
      orderBy: {
        roomNumber: "asc",
      },
    }),
  ]);

  return { guests, rooms };
}
