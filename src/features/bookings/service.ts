import { BookingStatus, Prisma, RoomStatus } from "@prisma/client";
import {
  calculateStayNights,
  isValidStayDateRange,
} from "@/features/bookings/rules";
import {
  isOverlappingBookingConstraintError,
  runSerializableTransaction,
} from "@/server/db/transaction";
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

  try {
    return await runSerializableTransaction(async (tx) => {
      await validateGuestExists(input.guestId, tx);
      const room = await validateRoomCanBeBooked({
        roomId: input.roomId,
        checkInDate: dates.checkInDate,
        checkOutDate: dates.checkOutDate,
        tx,
      });
      const totalAmount = calculateBookingTotal({
        checkInDate: dates.checkInDate,
        checkOutDate: dates.checkOutDate,
        pricePerNight: room.pricePerNight,
      });

      return tx.booking.create({
        data: {
          guestId: input.guestId,
          roomId: input.roomId,
          checkInDate: dates.checkInDate,
          checkOutDate: dates.checkOutDate,
          totalAmount,
          createdById,
          status: BookingStatus.PENDING,
        },
      });
    });
  } catch (error) {
    throwFriendlyOverlapError(error);
  }
}

export async function updateBooking(bookingId: string, input: BookingFormInput) {
  const dates = parseBookingDates(input);

  try {
    return await runSerializableTransaction(async (tx) => {
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
      const room = await validateRoomCanBeBooked({
        roomId: input.roomId,
        checkInDate: dates.checkInDate,
        checkOutDate: dates.checkOutDate,
        excludeBookingId: bookingId,
        tx,
      });
      const totalAmount = calculateBookingTotal({
        checkInDate: dates.checkInDate,
        checkOutDate: dates.checkOutDate,
        pricePerNight: room.pricePerNight,
      });

      return tx.booking.update({
        where: { id: bookingId },
        data: {
          guestId: input.guestId,
          roomId: input.roomId,
          checkInDate: dates.checkInDate,
          checkOutDate: dates.checkOutDate,
          totalAmount,
        },
      });
    });
  } catch (error) {
    throwFriendlyOverlapError(error);
  }
}

export async function cancelBooking(bookingId: string) {
  return runSerializableTransaction(async (tx) => {
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

    return tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });
  });
}

function parseBookingDates(input: BookingFormInput) {
  const checkInDate = toDate(input.checkInDate);
  const checkOutDate = toDate(input.checkOutDate);

  if (
    !checkInDate ||
    !checkOutDate ||
    !isValidStayDateRange(checkInDate, checkOutDate)
  ) {
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
      pricePerNight: true,
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

  return room;
}

function calculateBookingTotal({
  checkInDate,
  checkOutDate,
  pricePerNight,
}: {
  checkInDate: Date;
  checkOutDate: Date;
  pricePerNight: Prisma.Decimal;
}) {
  const nights = calculateStayNights(checkInDate, checkOutDate);

  return pricePerNight.mul(nights);
}

function throwFriendlyOverlapError(error: unknown): never {
  if (isOverlappingBookingConstraintError(error)) {
    throw new BookingRuleError(
      "This room was just booked for the selected dates. Choose another room or date range.",
    );
  }

  throw error;
}
