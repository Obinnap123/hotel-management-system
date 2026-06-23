import { BookingStatus, Prisma, RoomStatus, UserRole, UserStatus } from "@prisma/client";
import { findAvailableRoomForRoomType } from "@/lib/public/availability";
import { formatPublicBookingNumber } from "@/lib/public/format";
import { prisma } from "@/server/db/prisma";
import type { PublicReservationInput } from "./validation";
import { toPublicDate } from "./validation";

export class PublicReservationRuleError extends Error {}

export type PublicReservationResult = {
  bookingId: string;
  bookingNumber: string;
  roomTypeName: string;
  checkInDate: Date;
  checkOutDate: Date;
};

export async function createPublicReservation(
  input: PublicReservationInput,
): Promise<PublicReservationResult> {
  const dates = parseReservationDates(input);

  return prisma.$transaction(async (tx) => {
    const roomType = await tx.roomType.findUnique({
      where: {
        slug: input.roomTypeSlug,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!roomType) {
      throw new PublicReservationRuleError("Selected room type was not found.");
    }

    const room = await findAvailableRoomForRoomType({
      roomTypeId: roomType.id,
      checkInDate: dates.checkInDate,
      checkOutDate: dates.checkOutDate,
      tx,
    });

    if (!room) {
      throw new PublicReservationRuleError(
        "No rooms are available for the selected dates.",
      );
    }

    if (input.guestCount > room.capacity) {
      throw new PublicReservationRuleError(
        "Number of guests exceeds this room type capacity.",
      );
    }

    const [guest, createdById] = await Promise.all([
      findOrCreateGuest(input, tx),
      getPublicBookingCreatorId(tx),
    ]);
    const totalAmount = calculateReservationTotal({
      checkInDate: dates.checkInDate,
      checkOutDate: dates.checkOutDate,
      pricePerNight: room.pricePerNight,
    });

    const booking = await tx.booking.create({
      data: {
        guestId: guest.id,
        roomId: room.id,
        checkInDate: dates.checkInDate,
        checkOutDate: dates.checkOutDate,
        totalAmount,
        guestCount: input.guestCount,
        specialRequests: input.specialRequests || null,
        createdById,
        status: BookingStatus.PENDING,
      },
    });

    await tx.room.update({
      where: {
        id: room.id,
      },
      data: {
        status: RoomStatus.RESERVED,
      },
    });

    return {
      bookingId: booking.id,
      bookingNumber: formatPublicBookingNumber(booking.id),
      roomTypeName: roomType.name,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
    };
  });
}

function parseReservationDates(input: PublicReservationInput) {
  const checkInDate = toPublicDate(input.checkInDate);
  const checkOutDate = toPublicDate(input.checkOutDate);

  if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate) {
    throw new PublicReservationRuleError("Enter a valid reservation date range.");
  }

  return { checkInDate, checkOutDate };
}

async function findOrCreateGuest(
  input: PublicReservationInput,
  tx: Prisma.TransactionClient,
) {
  const existingByPhone = await tx.guest.findUnique({
    where: {
      phoneNumber: input.phoneNumber,
    },
    select: {
      id: true,
    },
  });

  if (existingByPhone) {
    return tx.guest.update({
      where: {
        id: existingByPhone.id,
      },
      data: {
        fullName: input.fullName,
        email: input.email,
      },
      select: {
        id: true,
      },
    });
  }

  const existingByEmail = await tx.guest.findFirst({
    where: {
      email: input.email,
    },
    select: {
      id: true,
    },
  });

  if (existingByEmail) {
    return tx.guest.update({
      where: {
        id: existingByEmail.id,
      },
      data: {
        fullName: input.fullName,
        phoneNumber: input.phoneNumber,
      },
      select: {
        id: true,
      },
    });
  }

  return tx.guest.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      phoneNumber: input.phoneNumber,
    },
    select: {
      id: true,
    },
  });
}

async function getPublicBookingCreatorId(tx: Prisma.TransactionClient) {
  const configuredUserId = process.env.PUBLIC_BOOKING_CREATED_BY_ID;

  if (configuredUserId) {
    const configuredUser = await tx.user.findUnique({
      where: {
        id: configuredUserId,
      },
      select: {
        id: true,
      },
    });

    if (configuredUser) {
      return configuredUser.id;
    }
  }

  const admin = await tx.user.findFirst({
    where: {
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
    },
  });

  if (!admin) {
    throw new PublicReservationRuleError(
      "Public reservations require an active admin user.",
    );
  }

  return admin.id;
}

function calculateReservationTotal({
  checkInDate,
  checkOutDate,
  pricePerNight,
}: {
  checkInDate: Date;
  checkOutDate: Date;
  pricePerNight: Prisma.Decimal;
}) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const nights = Math.max(
    1,
    Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / millisecondsPerDay,
    ),
  );

  return pricePerNight.mul(nights);
}
