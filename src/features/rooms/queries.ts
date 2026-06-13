import { prisma } from "@/server/db/prisma";

export async function getRooms() {
  return prisma.room.findMany({
    include: {
      roomType: true,
      _count: {
        select: {
          bookings: true,
        },
      },
    },
    orderBy: {
      roomNumber: "asc",
    },
  });
}

export async function getRoomTypes() {
  return prisma.roomType.findMany({
    include: {
      _count: {
        select: {
          rooms: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}
