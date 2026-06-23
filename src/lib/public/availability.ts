import { BookingStatus, Prisma, RoomStatus } from "@prisma/client";

const publicBlockingBookingStatuses: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.CHECKED_IN,
];

type AvailabilityClient = Pick<Prisma.TransactionClient, "room">;

export async function findAvailableRoomForRoomType({
  checkInDate,
  checkOutDate,
  roomTypeId,
  tx,
}: {
  checkInDate: Date;
  checkOutDate: Date;
  roomTypeId: string;
  tx: AvailabilityClient;
}) {
  return tx.room.findFirst({
    where: {
      roomTypeId,
      status: {
        not: RoomStatus.MAINTENANCE,
      },
      bookings: {
        none: {
          status: {
            in: publicBlockingBookingStatuses,
          },
          checkInDate: {
            lt: checkOutDate,
          },
          checkOutDate: {
            gt: checkInDate,
          },
        },
      },
    },
    orderBy: {
      roomNumber: "asc",
    },
    select: {
      id: true,
      pricePerNight: true,
      capacity: true,
    },
  });
}

export async function countAvailableRoomsForRoomType({
  checkInDate,
  checkOutDate,
  roomTypeId,
  tx,
}: {
  checkInDate: Date;
  checkOutDate: Date;
  roomTypeId: string;
  tx: AvailabilityClient;
}) {
  return tx.room.count({
    where: {
      roomTypeId,
      status: {
        not: RoomStatus.MAINTENANCE,
      },
      bookings: {
        none: {
          status: {
            in: publicBlockingBookingStatuses,
          },
          checkInDate: {
            lt: checkOutDate,
          },
          checkOutDate: {
            gt: checkInDate,
          },
        },
      },
    },
  });
}
