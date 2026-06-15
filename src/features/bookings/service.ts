import { BookingStatus, Prisma, RoomStatus } from "@prisma/client";
import {
  markRoomAvailable,
  markRoomReserved,
} from "@/features/rooms/status";
import { prisma } from "@/server/db/prisma";
import type { BookingFormInput } from "./validation";
import { toDate } from "./validation";

const blockingBookingStatuses: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.CHECKED_IN,
];

const editableBookingStatuses: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
];

export class BookingRuleError extends Error {}

export async function createBooking(
  input: BookingFormInput,
  createdById: string,
) {
  const dates = parseBookingDates(input);

  return prisma.$transaction(async (tx) => {
    await validateGuestExists(input.guestId, tx);
    await validateRoomCanBeBooked({
      roomId: input.roomId,
      checkInDate: dates.checkInDate,
      checkOutDate: dates.checkOutDate,
      tx,
    });

    const booking = await tx.booking.create({
      data: {
        guestId: input.guestId,
        roomId: input.roomId,
        checkInDate: dates.checkInDate,
        checkOutDate: dates.checkOutDate,
        createdById,
        status: BookingStatus.PENDING,
      },
    });

    await markRoomReserved(input.roomId, tx);

    return booking;
  });
}

export async function updateBooking(bookingId: string, input: BookingFormInput) {
  const dates = parseBookingDates(input);

  return prisma.$transaction(async (tx) => {
    const existingBooking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!existingBooking) {
      throw new BookingRuleError("Booking was not found.");
    }

    if (!editableBookingStatuses.includes(existingBooking.status)) {
      throw new BookingRuleError(
        "Only pending or confirmed bookings can be edited.",
      );
    }

    await validateGuestExists(input.guestId, tx);
    await validateRoomCanBeBooked({
      roomId: input.roomId,
      checkInDate: dates.checkInDate,
      checkOutDate: dates.checkOutDate,
      excludeBookingId: bookingId,
      tx,
    });

    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        guestId: input.guestId,
        roomId: input.roomId,
        checkInDate: dates.checkInDate,
        checkOutDate: dates.checkOutDate,
      },
    });

    if (existingBooking.roomId !== input.roomId) {
      await markRoomAvailable(existingBooking.roomId, tx);
    }

    await markRoomReserved(input.roomId, tx);

    return updatedBooking;
  });
}

export async function cancelBooking(bookingId: string) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new BookingRuleError("Booking was not found.");
    }

    if (!editableBookingStatuses.includes(booking.status)) {
      throw new BookingRuleError(
        "Only pending or confirmed bookings can be cancelled.",
      );
    }

    const cancelledBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });

    await markRoomAvailable(booking.roomId, tx);

    return cancelledBooking;
  });
}

function parseBookingDates(input: BookingFormInput) {
  const checkInDate = toDate(input.checkInDate);
  const checkOutDate = toDate(input.checkOutDate);

  if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate) {
    throw new BookingRuleError("Enter a valid booking date range.");
  }

  return { checkInDate, checkOutDate };
}

async function validateGuestExists(
  guestId: string,
  tx: Prisma.TransactionClient,
) {
  const guest = await tx.guest.findUnique({
    where: { id: guestId },
    select: { id: true },
  });

  if (!guest) {
    throw new BookingRuleError("Selected guest was not found.");
  }
}

async function validateRoomCanBeBooked({
  roomId,
  checkInDate,
  checkOutDate,
  excludeBookingId,
  tx,
}: {
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  excludeBookingId?: string;
  tx: Prisma.TransactionClient;
}) {
  const room = await tx.room.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!room) {
    throw new BookingRuleError("Selected room was not found.");
  }

  if (room.status === RoomStatus.MAINTENANCE) {
    throw new BookingRuleError("Rooms under maintenance cannot be booked.");
  }

  const overlappingBooking = await tx.booking.findFirst({
    where: {
      roomId,
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      status: {
        in: blockingBookingStatuses,
      },
      checkInDate: {
        lt: checkOutDate,
      },
      checkOutDate: {
        gt: checkInDate,
      },
    },
    select: {
      id: true,
    },
  });

  if (overlappingBooking) {
    throw new BookingRuleError(
      "This room is already booked for the selected dates.",
    );
  }
}
