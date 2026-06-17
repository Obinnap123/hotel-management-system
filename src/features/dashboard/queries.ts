import { BookingStatus, RoomStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export async function getDashboardOverview() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const tomorrowStart = addDays(todayStart, 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [
    totalRooms,
    availableRooms,
    occupiedRooms,
    reservedRooms,
    maintenanceRooms,
    totalGuests,
    todaysCheckIns,
    todaysCheckOuts,
    revenueToday,
    revenueThisMonth,
    todaysArrivals,
    todaysDepartures,
    activeStays,
    recentPayments,
  ] = await Promise.all([
    prisma.room.count(),
    prisma.room.count({ where: { status: RoomStatus.AVAILABLE } }),
    prisma.room.count({ where: { status: RoomStatus.OCCUPIED } }),
    prisma.room.count({ where: { status: RoomStatus.RESERVED } }),
    prisma.room.count({ where: { status: RoomStatus.MAINTENANCE } }),
    prisma.guest.count(),
    prisma.booking.count({
      where: {
        checkedInAt: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
    }),
    prisma.booking.count({
      where: {
        checkedOutAt: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
    }),
    prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        paymentDate: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
    }),
    prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        paymentDate: {
          gte: monthStart,
          lt: nextMonthStart,
        },
      },
    }),
    prisma.booking.findMany({
      where: {
        checkInDate: {
          gte: todayStart,
          lt: tomorrowStart,
        },
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
      },
      include: bookingListInclude,
      orderBy: {
        checkInDate: "asc",
      },
      take: 5,
    }),
    prisma.booking.findMany({
      where: {
        checkOutDate: {
          gte: todayStart,
          lt: tomorrowStart,
        },
        status: BookingStatus.CHECKED_IN,
      },
      include: bookingListInclude,
      orderBy: {
        checkOutDate: "asc",
      },
      take: 5,
    }),
    prisma.booking.findMany({
      where: {
        status: BookingStatus.CHECKED_IN,
      },
      include: bookingListInclude,
      orderBy: {
        checkedInAt: "desc",
      },
      take: 5,
    }),
    prisma.payment.findMany({
      include: {
        booking: {
          include: {
            guest: true,
            room: true,
          },
        },
        recordedBy: true,
      },
      orderBy: {
        paymentDate: "desc",
      },
      take: 5,
    }),
  ]);

  return {
    stats: {
      totalRooms,
      availableRooms,
      occupiedRooms,
      reservedRooms,
      maintenanceRooms,
      totalGuests,
      todaysCheckIns,
      todaysCheckOuts,
      revenueToday: revenueToday._sum.amount?.toString() ?? "0",
      revenueThisMonth: revenueThisMonth._sum.amount?.toString() ?? "0",
    },
    todaysArrivals,
    todaysDepartures,
    activeStays,
    recentPayments,
  };
}

const bookingListInclude = {
  guest: true,
  room: {
    include: {
      roomType: true,
    },
  },
} as const;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}
