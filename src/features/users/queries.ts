import { prisma } from "@/server/db/prisma";

export async function getStaffUsers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          bookingsCreated: true,
          paymentsRecorded: true,
          bookingsCheckedIn: true,
          bookingsCheckedOut: true,
        },
      },
    },
  });
}
