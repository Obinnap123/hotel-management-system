import { BookingStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export async function getPayments() {
  return prisma.payment.findMany({
    include: {
      booking: {
        include: {
          guest: true,
          room: {
            include: {
              roomType: true,
            },
          },
        },
      },
      recordedBy: true,
    },
    orderBy: {
      paymentDate: "desc",
    },
  });
}

export async function getPendingBookingsEligibleForPayment() {
  return prisma.booking.findMany({
    where: {
      status: BookingStatus.PENDING,
      payment: null,
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
      createdAt: "desc",
    },
  });
}

export async function getPaymentByBooking(bookingId: string) {
  return prisma.payment.findUnique({
    where: {
      bookingId,
    },
  });
}
